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

                let weaken = 14
                let grow = 47
                let hack = 16

                await ns.exec("weaken.script", currentServer, weaken, currentTarget)
                await ns.exec("grow.script", currentServer, grow, currentTarget)
                await ns.exec("hacker.script", currentServer, hack, currentTarget)
                await ns.sleep(5)
            }
        }
    }
}