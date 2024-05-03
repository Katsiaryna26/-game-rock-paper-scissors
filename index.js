const readline = require('readline-sync');
const CryptoJS = require('crypto-js');
let {AsciiTable3, AlignmentEnum } = require('ascii-table3');

const args = process.argv.slice(2);

class Program{
    
    checkArgs(args){
        if (args.length<3 || args.length%2 ===0 || new Set(args).size!==args.length){
            console.log( "Error: Incorrect input format. Please provide an odd number greater than or equal to 3 of unique strings as arguments.");
        } else {
            const choices=args;
            pr.main(args)
        }
    }
    main(args){
        const security = new Security();
        const table = new Table(args);
        const judge = new Judge(args.length);

        let gameFinished=false
        while (!gameFinished){

        const key = security.GenerateKey();
        const computerMove = Math.floor(Math.random() * args.length);
        const hmac = security.GenerateHMAC(key, args[computerMove]);

       console.log("HMAC: " + hmac);

        console.log("Available moves:")
        for (let i=0; i<args.length; i++){
            console.log(i+1+ "-" +args[i])  
        }
        console.log("0 - Exit")
        console.log("? - Help")
        console.log("Enter your move:")
        const ans = readline.question();
        if (ans === "?") {
             table.print();
            console.log("\n\n");
            continue
        }
        if (ans === "0") {
            gameFinished = true
            continue
        }

        let playerMove = 0;

        if (isNaN(parseInt(ans)) || parseInt(ans) <= 0 || parseInt(ans) > args.length) {
            console.log("\n\n");
            continue;
        }

        console.log("Your move: " + args[parseInt(ans) - 1]);
        console.log("Computer move: " + args[computerMove]);

        const outcome = judge.decide(computerMove, parseInt(ans) - 1);

        switch (outcome) {
            case Outcome.WIN:
                console.log("You won!");
                break;
            case Outcome.LOSE:
                console.log("You lost!");
                break;
            default:
                console.log("Draw!");
                break;
        }

        console.log("HMAC key: " + key);
        console.log("\n\n");

        }}
    
}
   
    class Security {
        GenerateKey() {
            const ke = CryptoJS.lib.WordArray.random(256/8);
            const bytes = ke.toString(CryptoJS.enc.Hex);

            return Array.from(bytes).map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
        }
    
        GenerateHMAC(key, message) {
            let hash = CryptoJS.HmacSHA3(message, key);
            const hmacHex = hash.toString(CryptoJS.enc.Hex);
            return Array.from(hmacHex).map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
        }
    }

    const Outcome = {
        WIN: 'WIN',
        LOSE: 'LOSE',
        DRAW: 'DRAW'
    }
    
    class Judge {
        constructor(movesCount) {
            this.MovesCount = movesCount;
        }
    
        decide(firstMove, secondMove) {
            if (firstMove === secondMove) {
                return Outcome.DRAW;
            }
    
            if ((secondMove > firstMove && secondMove - firstMove <= this.MovesCount / 2) || (secondMove < firstMove && firstMove - secondMove > this.MovesCount / 2)) {
                return Outcome.WIN;
            }
    
            return Outcome.LOSE;
        }
    }

    class Table {
        constructor(names) {
            this.Names = names;
        }
    
        print() {
            const headerItems = ["PC \\ User", ...this.Names];
            const table = new AsciiTable3("Help");
            table.setHeading(headerItems)
            table.setAlign ( headerItems ,  AlignmentEnum.CENTER )
    
            const judge = new Judge(this.Names.length);
    
            for (let i = 0; i < this.Names.length; i++) {
                const currentRow = new Array(this.Names.length + 1);
                currentRow[0] = this.Names[i];
    
                for (let j = 0; j < this.Names.length; j++) {
                    currentRow[j + 1] = Outcome[judge.decide(i, j)];
                }
                table.setStyle('compact');
                table.addRow(currentRow);
            }
        
            console.log(table.toString())
        }
    }
    
let pr = new Program(args);
pr.checkArgs(args)

