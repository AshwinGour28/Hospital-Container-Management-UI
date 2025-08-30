export const getContainerStats = async (dockerContainer) => {
    return new Promise((resolve, reject) => {
        dockerContainer.stats({stream: false}, (err, stats)=>{
            if(err) return reject(err);

            try {
                const memoryUsage = (stats.memory_stats?.usage / (1024*1024)).toFixed(2);
                const memoryLimit = (stats.memory_stats?.limit / (1024*1024)).toFixed(2);

                const cpuDelta = stats.cpu_stats?.cpu_usage?.total_usage - stats.precpu_stats?.cpu_usage?.total_usage
                const systemDelta = stats.cpu_stats?.system_cpu_usage - stats.precpu_stats?.system_cpu_usage;
                let cpuUsage = 0;
                if(systemDelta > 0 && cpuDelta > 0){
                    cpuUsage = ((cpuDelta/systemDelta) * stats.cpu_stats.online_cpus*100).toFixed(2);
                }

                resolve({
                    memoryUsage: `${memoryUsage} MB / ${memoryLimit} MB`,
                    cpuUsage: `${cpuUsage} %`
                });
                
            } catch (e) {
                resolve({
                    memoryUsage: "N/A",
                    cpuUsage: "N/A"
                })
            }
        })
    })
}