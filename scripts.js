const fs = require("fs");
const path = require("path");

const copyConfig = {
    // if there is (at [only] block) at least one item from some directory
    // that at the same time is not present in [except] then other ones from
    // this dir not pointed in [only] are ignored
    only: ["assets", "assets\\js\\admin-panel\\build", "functions.php", "index.php"],
    except: [],
};

function makeDirRecursively(dir) {
    if (!fs.existsSync(dir)) {
        makeDirRecursively(path.dirname(dir));
        fs.mkdirSync(dir);
    }
}

function intendMark(intends, lastItem = false) {
    if (intends.length == 0) return "";
    return (
        intends.reduce(
            (prev, cur, i) => prev + (i == intends.length - 1 ? "" : cur ? "|   " : "    "),
            ""
        ) + (lastItem ? "`-- " : "|-- ")
    );
}

function pickyCopy(src, dst, config, intends = []) {
    if (!fs.existsSync(src)) return;
    makeDirRecursively(dst);
    if (intends.length == 0) {
        console.log("\x1b[33m" + src + "\x1b[0m");
        intends.push(1);
    }
    const onlys = config.only;
    const excepts = config.except;
    let currentOnlys = [];
    const currentItems = [];
    fs.readdirSync(src);
    fs.readdirSync(src).forEach((item) => {
        const itemAbs = path.resolve(src, item);
        const itemRel = path.relative(__dirname, itemAbs);
        if (onlys.includes(itemRel)) currentOnlys.push(item);
        if (!excepts.includes(itemRel)) currentItems.push(item);
    });
    if (!currentOnlys.length) currentOnlys = currentItems;
    currentOnlys.forEach((item, i) => {
        const itemAbs = path.resolve(src, item);
        let lastItem = i == currentOnlys.length - 1;
        if (fs.lstatSync(itemAbs).isFile()) {
            fs.copyFileSync(itemAbs, path.resolve(dst, item));
            console.log(
                intendMark(intends, lastItem) +
                    "\x1b[33m" +
                    path.relative(src, itemAbs) +
                    "\x1b[0m\x1b[32m copied\x1b[0m"
            );
        } else {
            const nextIntends = [...intends, 1];
            if (lastItem) nextIntends[nextIntends.length - 2] = 0;
            console.log(
                intendMark(intends, lastItem) +
                    "\x1b[33m" +
                    path.relative(src, itemAbs) +
                    "\x1b[0m\x1b[32m copied\x1b[0m"
            );

            pickyCopy(itemAbs, path.resolve(dst, item), copyConfig, nextIntends);
        }
    });
}

function release() {
    console.log("\nRelease bundling...\n");
    const releaseDir = path.resolve(__dirname, "release/");
    if (fs.existsSync(releaseDir)) fs.rmSync(releaseDir, { recursive: true });
    pickyCopy(__dirname, releaseDir, copyConfig);
    console.log("\n\x1b[32mOperation succesefully completed!\x1b[0m");
}

if (process.argv.includes("--rebuild")) {
    const child = require("child_process").exec(
        'npm --prefix "' + path.resolve(__dirname, "assets\\js\\admin-panel") + '" run build'
    );
    child.stdout.pipe(process.stdout);
    child.on("exit", function () {
        if (process.argv.includes("--release")) release();
        process.exit();
    });
} else if (process.argv.includes("--release")) release();
