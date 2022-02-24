/** @param {NS} ns **/
export async function main(ns) {
    // Start walk from home
    var target = ns.args[0]
    var ownedServers = ns.getPurchasedServers()
    ownedServers.push("darkweb")

    var startNode = "home"
    var visited = []
    var path = []
    var stack = []
    stack.push(startNode)

    // Walk and get all nodes on network
    while (stack.length > 0) {
        let currentServer = stack.pop()

        if (visited.includes(currentServer) || ownedServers.includes(currentServer)) {} else {
            path.push(currentServer)
            let nextStack = ns.scan(currentServer)

            if (nextStack.includes(target)) {
                stack = []
                path.push(target)
                continue
            }
            stack.push(...nextStack)
            visited.push(currentServer)
        }
    }
    ns.tprint("Path to ", target, ": ", path)
}