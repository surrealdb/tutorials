import fs from 'fs';

const guideIntroTemplate = fs.readFileSync('./theme/guideIntro.html').toString();
const rootSummary = {
    content: fs.readFileSync('./SUMMARY.md').toString(),
    officialLinks: '- [Introduction](official/00-SUMMARY.md)',
    communityLinks: '- [Introduction](community/00-SUMMARY.md)'
};

function FillGuideIntro(g) {
    let tmpl = guideIntroTemplate;
    tmpl = tmpl.replace('{{TITLE}}', g.title);
    tmpl = tmpl.replace('{{CREATOR}}', g.creator);
    tmpl = tmpl.replace('{{LINK}}', g.link);
    return tmpl;
}

function CollectFolderGuides(folder) {
    let guides = [];
    let summaryLinks = "\n";
    const matchOptions = /^---\ntitle: (.*)\ncreator: (.*)\nlink: (.*)\n---$/m;
    const files = fs.readdirSync(`./${folder}/`).filter(f => !f.startsWith('00-'));

    files.forEach(f => {
        const path = `./${folder}/${f}`;
        const content = fs.readFileSync(path).toString();
        const matchedOptions = content.match(matchOptions);
        if (!matchedOptions) {
            console.error("Guide has invalid config options");
            console.error(`  - ${f}`);
            process.kill(1);
        }

        const guide = {
            title: matchedOptions[1],
            creator: matchedOptions[2],
            link: matchedOptions[3],
            file: f
        };

        fs.writeFileSync(path, content.replace(matchedOptions[0], FillGuideIntro(guide)))
        summaryLinks += `\n- [${guide.title}](${guide.file}) - [${guide.creator}](${guide.link})`;
        rootSummary[`${folder}Links`] += `\n    - [${guide.title}](${folder}/${guide.file})`;
        guides.push(guide);
    });

    fs.appendFileSync(`./${folder}/00-SUMMARY.md`, summaryLinks);
    rootSummary.content = rootSummary.content.replace(`- [Introduction](${folder}/00-SUMMARY.md)`, rootSummary[`${folder}Links`]);
}   

CollectFolderGuides('official');
CollectFolderGuides('community');
fs.writeFileSync('./SUMMARY.md', rootSummary.content);