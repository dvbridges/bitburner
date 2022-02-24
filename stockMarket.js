/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep")
    let all = ns.stock.getSymbols()
    let stocks = []

    var maxStocks = 100000

    for (let i = 0; i < 10000000; i++) {
        for (let each in all) {
            let current = all[each]
            let sym = {}
            sym["symbol"] = current
            sym["forecast"] = ns.stock.getForecast(current)
            sym["price"] = ns.stock.getPrice(current)
            sym["count"] = ns.stock.getPosition(current)[0]
            stocks.push(sym)
        }

        for (let each in stocks) {
            let stk = stocks[each]
                // Check if the stocks are ready to buy
            if (stk["count"] == 0) {
                if (stk["forecast"] > .6) {
                    ns.print("buying stock in ", stk["symbol"])
                    ns.stock.buy(stk["symbol"], maxStocks)
                }
            }

            // Check stock movement
            if (stk["count"] > 0) {
                // Get direction
                if (stk["forecast"] < .6) {
                    ns.print("selling stock in ", stk["symbol"])
                    ns.print("predicted profit - Long - ", ns.stock.getSaleGain(stk["symbol"], maxStocks, "Long"))
                    ns.stock.sell(stk["symbol"], maxStocks)
                }
            }
        }
        stocks = []

        await ns.sleep(3000)
    }

    // Other things to consinder
    // ns.codingcontract
}