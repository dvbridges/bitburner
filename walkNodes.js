/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL")
    var visited = []
    var stack = []
    var ownedServers = ns.getPurchasedServers()
    ownedServers.push("darkweb") // dont hack darkweb
    var currentServer
    stack.push(ns.getHostname())
    var portHackers = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']
    var hackablePorts = ns.ls("home", ".exe").filter(a => portHackers.includes(a))

    // Walk and get all nodes on network
    while (stack.length > 0) {
        currentServer = stack.pop()
        if (visited.includes(currentServer) || ownedServers.includes(currentServer)) {} else {
            ns.tprint("visiting ", currentServer)
            stack.push(...ns.scan(currentServer))
            visited.push(currentServer)
        }
    }

    // open ports
    for (let each in visited) {
        let currentTarget = visited[each]
        ns.tprint("opening ports on ", currentTarget)
        if (ns.fileExists(portHackers[0], 'home')) {
            ns.brutessh(currentTarget)
        }
        if (ns.fileExists(portHackers[1], 'home')) {
            ns.ftpcrack(currentTarget)
        }
        if (ns.fileExists(portHackers[2], 'home')) {
            ns.relaysmtp(currentTarget)
        }
        if (ns.fileExists(portHackers[3], 'home')) {
            ns.httpworm(currentTarget)
        }
        if (ns.fileExists(portHackers[4], 'home')) {
            ns.sqlinject(currentTarget)
        }
    }

    // get root access
    for (let each in visited) {
        let currentTarget = visited[each]
        let nPorts = ns.getServerNumPortsRequired(currentTarget);
        // check if we can run nuke 
        if (nPorts <= hackablePorts.length) {
            ns.tprint("running nuke on ", currentTarget)
            if (ns.fileExists("NUKE.exe", 'home')) {
                ns.nuke(currentTarget)
            }
        }
    }
}