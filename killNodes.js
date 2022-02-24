/** @param {NS} ns **/
export async function main(ns) {
    var visited = []
    var stack = []
    var ownedServers = ns.getPurchasedServers()
    ownedServers.push("darkweb") // dont hack darkweb
    var currentServer
    stack.push(ns.getHostname())
    var portHackers = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe']

    // Walk and get all nodes on network
    while (stack.length > 0) {
        currentServer = stack.pop()
        if (visited.includes(currentServer) || ownedServers.includes(currentServer)) {} else {
            ns.print("visiting ", currentServer)
            stack.push(...ns.scan(currentServer))
            visited.push(currentServer)
        }
    }

    // open ports
    ownedServers.push("home")
    for (let each in visited) {
        let currentTarget = visited[each]
        if (!ownedServers.includes(currentTarget)) {
            ns.killall(currentTarget)
        }
    }
}