/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL")

    var visited = []
    var stack = []
    var deployStack = []
    var currentServer

    var ownedServers = ns.getPurchasedServers()
    ownedServers.push("darkweb") // dont hack darkweb
    ownedServers.push("home")

    var hackFiles = ["weaken.script", "grow.script", "hacker.script", "deployHack.script"]
    var portHackers = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']

    stack.push(ns.getHostname())

    // Walk and get all nodes on network
    while (stack.length > 0) {
        currentServer = stack.pop()
        if (visited.includes(currentServer)) {} else {
            // ns.print("visiting ", currentServer)
            stack.push(...ns.scan(currentServer))
            visited.push(currentServer)
        }
    }

    // copy over hack files
    for (let each in visited) {
        let currentTarget = visited[each]
            // ns.print("copying hacker files to ", currentTarget)
        await ns.scp(hackFiles, "home", currentTarget)
    }

    // start hacks from each node
    for (let each in visited) {
        currentServer = visited[each]
        deployStack.push(...ns.scan(currentServer))

        // Remove out of level and unopned port nodes, and owned nodes
        var removeNodes = []
        for (let each in deployStack) {
            let currentTarget = deployStack[each]
            let hackable = (ns.getServerRequiredHackingLevel(currentTarget) <= ns.getHackingLevel())
            let portsOpened = (ns.getServerNumPortsRequired(currentTarget) <= portHackers.length)
            let ownedServer = ownedServers.includes(currentTarget)
            let haveNoRam = (ns.getServerMaxRam(currentTarget) < 1)
            if (!hackable || !portsOpened || ownedServer || haveNoRam) {
                removeNodes.push(currentTarget)
            }
        }

        // remove unwanted nodes
        deployStack = deployStack.filter(node => !removeNodes.includes(node))
        var copyStack = [...deployStack]
        var totalServers = deployStack.length

        while (deployStack.length > 0) {
            let currentTarget = deployStack.pop()
                // calculate Ram per server
            let serverRam = ns.getServerMaxRam(currentServer)
            let availableRam = parseFloat(serverRam) / totalServers

            ns.tprint("server ", currentServer)
            ns.tprint("target ", currentTarget)
            ns.tprint("server ram ", serverRam)
            ns.tprint("Available ram ", availableRam)
            ns.tprint("n servers ", totalServers)
            ns.tprint("targets ", copyStack)

            // calculate how many threads can be run per hack type
            let threads = calculateThreads(ns, availableRam)
            let totalThreads = threads.reduce((a, b) => a + b, 0)

            ns.tprint("Allowed threads: ", threads)
            ns.tprint(currentServer, " ", currentTarget)

            await ns.exec("deployHack.script", "home", totalThreads, currentServer, currentTarget, threads[0], threads[1], threads[2])
            await ns.sleep(200)
        }
    }
    ns.enableLog("ALL")
}

function calculateThreads(ns, serverRam) {
    var weaken = 1.95
    var grow = 1.95
    var hack = 1.70

    var modifier1 = parseFloat((parseFloat(2) / 16).toFixed(3))
    var modifier2 = parseFloat((parseFloat(10) / 16).toFixed(3))
    var modifier3 = parseFloat((parseFloat(4) / 16).toFixed(3))

    var sumOf = weaken + grow + hack
    var freeRam = serverRam
    var threads = [1, 1, 1]

    for (let i = 0; i < 1000; i++) {
        let t1 = (threads[0] + modifier1)
        let t2 = (threads[1] + modifier2)
        let t3 = (threads[2] + modifier3)

        let w = weaken * (t1).toFixed(0)
        let g = grow * (t2).toFixed(0)
        let h = hack * (t3).toFixed(0)

        sumOf = w + g + h

        if (sumOf < freeRam) {
            threads[0] = t1
            threads[1] = t2
            threads[2] = t3
        } else {
            return [
                parseInt(threads[0].toFixed(0)),
                parseInt(threads[1].toFixed(0)),
                parseInt(threads[2].toFixed(0))
            ]
        }
    }
    return threads
}