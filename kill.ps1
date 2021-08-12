$port = $args[0];
# 要杀死的进程所在端口

$kill_process_name = $args[1];
# 要杀死的进程名称

$find_rest = netstat -aon | findstr ":$($port)";
# 按端口查找进程

if (!$find_rest) {
    return;
}

$find_rest = $find_rest.Split([Environment]::NewLine);
# 可能有多个进程，用换行符切割返回结果

for ($i = 0; $i -lt $find_rest.Count; $i++) {
    $params = $find_rest[$i].Split(" ", [StringSplitOptions]::RemoveEmptyEntries);
    # 用空格切割进程信息

    $_pid = $params[$params.Count - 1];
    # PID位于进程信息最后一栏

    $process_list_res = tasklist /FI "PID eq $($_pid)";
    # 按PID查询进程信息

    $process_list = $process_list_res.Split([Environment]::NewLine);
    # 切割进程信息

    $index = 3;

    if ([string]::IsNullOrEmpty($process_list[0])) {
        $index = 4;
    }
    # 不知道为什么总是会多个空字符，先这样将就一下

    if ($process_list.Count -ge $index) {
        $process_name = $process_list[$index - 1].Split(" ", [StringSplitOptions]::RemoveEmptyEntries)[0];
        # 获取进程名称

        if ($process_name -eq $kill_process_name) {
            taskkill /F /PID $_pid;
            # 进程名称相符就kill掉
        } else {
            Write-Host('');
            # 魔幻，为什么这里不加else就报语法错误???
        }
    }
}

