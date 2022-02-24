/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL")

    var visited = []
    var stack = []
    var currentServer

    var ownedServers = ns.getPurchasedServers()
    ownedServers.push("darkweb") // dont hack darkweb
    ownedServers.push("home")

    stack.push(ns.getHostname())

    // Walk and get all nodes on network
    while (stack.length > 0) {
        currentServer = stack.pop()
        if (visited.includes(currentServer)) {} else {
            stack.push(...ns.scan(currentServer))
            visited.push(currentServer)
        }
    }

    // copy over lit files
    for (let each in visited) {
        let currentTarget = visited[each]
        let files = ns.ls(currentTarget)
        let validFiles = files.filter(f => f.endsWith(".lit"))
        for (let file in validFiles) {
            let currentFile = validFiles[file]
            ns.tprint(currentFile, " ", currentTarget)
            await ns.scp(currentFile, currentTarget, "home")
        }
    }
}