/** @param {NS} ns **/
export async function main(ns) {
    var ownedServers = ns.getPurchasedServers()
    ownedServers.push('home')

    var blockedServers = ns.getPurchasedServers()
    blockedServers.push("darkweb")
    blockedServers.push("home")

    var servers = ns.scan(ns.getHostname());
    var hackFiles = ["weaken.script", "grow.script", "hacker.script", "deployHack.script"]

    servers = servers.filter(s => !blockedServers.includes(s))

    // Copy all hack files to servers
    for (let eachServer in ownedServers) {
        let current = ownedServers[eachServer]
        if (current != 'home') {
            await ns.scp(hackFiles, 'home', current)
        }
    }

    // Deploy the hack files at each of the servers
    for (let eachServer in ownedServers) {
        let currentServer = ownedServers[eachServer]
        for (let eachTarget in servers) {
            let currentTarget = servers[eachTarget]
            if (!blockedServers.includes(currentTarget)) {
                ns.print("deploying botnet: ", currentServer)
                    // await ns.exec("deployHack.script", "home", 6, currentServer, currentTarget, 3, 12, 4)

                let weaken = 6
                let weakenAgain = 7
                let grow = 50
                let hack = 14

                if (currentServer == "home") {
                    weaken *= 3
                    weakenAgain *= 3
                    grow *= 6
                    hack *= 6
                }
                // let hackLvl = ns.getHackingLevel()
                // let weakenTime = ns.getWeakenTime(currentServer, {hackLvl: hackLvl})
                // let growTime = ns.getGrowTime(currentServer, {hackLvl: hackLvl})
                // let hackTime = ns.getHackTime(currentServer, {hackLvl: hackLvl})

                // ns.tprint(weakenTime)
                // ns.tprint(growTime)
                // ns.tprint(hackTime)

                await ns.exec("weaken.script", currentServer, weaken, currentTarget)
                await ns.sleep(4000)
                await ns.exec("weaken2.script", currentServer, weakenAgain, currentTarget)
                await ns.sleep(2000)
                await ns.exec("grow.script", currentServer, grow, currentTarget)
                await ns.sleep(10000)
                await ns.exec("hacker.script", currentServer, hack, currentTarget)
                await ns.sleep(6000)
            }
        }
    }
}