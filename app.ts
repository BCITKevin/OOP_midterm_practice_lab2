import * as fs from 'node:fs/promises';
import { EOL } from 'node:os';

class CsvMenuParser {
    private _csvData: string[] = [];

    private constructor(data: string[]) {
        this._csvData = data;
    }

    static async buildMenu(filename: string) {
        const data = await fs.readFile(filename, 'utf8');
        return new CsvMenuParser(data.split(EOL));
    }

    async writeMenu(writer: IWritable) {
        const str = writer.prepareContent(this._csvData)
        writer.write(str);
    }

    getMenuData() {
        return this._csvData;
    }
}

class HtmlWriter {
    prepareContent(csvData: string[]) {
        const mealDataMap: { [key: string]: string[][] } = {};

        for (let i = 0; i < csvData.length; i++) {
            const data = csvData[i].split(',');
            const mealType = data[0];

            if (!mealDataMap[mealType]) {
                mealDataMap[mealType] = [];
            }

            mealDataMap[mealType].push(data);
        }

        console.log('Meal Data Map:', mealDataMap);

        let myStr = ``;

        for (const mealType in mealDataMap) {
            if (mealDataMap.hasOwnProperty(mealType)) {
                myStr += `
                    <table border='1'>
                        <tr>
                            <th scope='col'>${mealDataMap[mealType][0][0] + ' Items'}</th>
                        </tr>
                `;

                for (let i = 0; i < mealDataMap[mealType].length; i++) {
                    myStr += `
                        <tr>
                            <td>${mealDataMap[mealType][i][3]}, ${mealDataMap[mealType][i][1]}, ${mealDataMap[mealType][i][2]}</td>
                        </tr>
                    `;
                }

                myStr += `
                    </table>
                `;
            }
        }

        return myStr;
    }
    async write(menuStr: string): Promise<void> {
        return await fs.writeFile('csv.html', menuStr);
    }
}

class TextWriter {
    prepareContent(csvData: string[]) {
        const mealDataMap: { [key: string]: string[][] } = {};

        for (let i = 0; i < csvData.length; i++) {
            const data = csvData[i].split(',');
            const mealType = data[0];

            if (!mealDataMap[mealType]) {
                mealDataMap[mealType] = [];
            }

            mealDataMap[mealType].push(data);
        }

        let myStr = ``;

        for (const mealType in mealDataMap) {
            if (mealDataMap.hasOwnProperty(mealType)) {
                myStr += `
                * ${mealDataMap[mealType][0][0] + ' Items'} *\n
                `;
                for (let i = 0; i < mealDataMap[mealType].length; i++) {
                    myStr += `
                    ${mealDataMap[mealType][i][3]}, ${mealDataMap[mealType][i][1]}, ${mealDataMap[mealType][i][2]}
                    `;
                }
            }
        }
        return myStr;
    }
    async write(menuStr: string) {
        return await fs.writeFile('csv.txt', menuStr);
    }

}

interface IWritable {
    write(menuStr: string): Promise<void>; // This is very important
    prepareContent(menuStr: string[]): string; // This is very important
}

async function main() {
    const menu = await CsvMenuParser.buildMenu('menu.csv');
    menu.writeMenu(new HtmlWriter())
    menu.writeMenu(new TextWriter())
}
main();