/** @param {NS} ns **/
export async function main(ns) {
    var ownedServers = ns.getPurchasedServers()
    ownedServers.push('home')
    for (let eachBot in ownedServers) {
        let currentBot = ownedServers[eachBot]
        ns.killall(currentBot)
    }
}