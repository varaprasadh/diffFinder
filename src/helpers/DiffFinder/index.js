export default class DiffFinder {

    buildDiffMatrix = (original, modified) => {
        const rows = original.length;
        const cols = modified.length;

        const matrix = Array.from(new Array(rows+1)).map(_ => {
            return Array.from(new Array(cols+1)).map(i => 0);
        });

        for (let originalLeft = 1; originalLeft <= rows; originalLeft++){
            for(let modifiedLeft = 1; modifiedLeft <=cols; modifiedLeft++ ){
                if(original.charAt(originalLeft-1) === modified.charAt(modifiedLeft-1)){
                    matrix[originalLeft][modifiedLeft] = 1 + matrix[originalLeft-1][modifiedLeft-1];
                }else{
                    matrix[originalLeft][modifiedLeft] = Math.max(
                        matrix[originalLeft-1][modifiedLeft],
                        matrix[originalLeft][modifiedLeft-1]
                    )
                }
            }
        }

        return {
            diffMatrix : matrix,
            original,
            modified,
            sequenceLength: matrix[rows][cols]
        }
 
    }
    // rewrite this whole thing
    getDiffSegments = (
    originalContent,
        modifiedContent,
        diffMatrix
    ) => {

        let originalRight = originalContent.length;
        let modifiedRight = modifiedContent.length;
        let segments = [];
        while (originalRight > 0 && modifiedRight > 0) {
            if (
                originalContent.charAt(originalRight-1) ===
                modifiedContent.charAt(modifiedRight-1)
            ) {
                segments.push({
                    key:Math.random(),
                    type: "NO_CHANGE",
                    content: originalContent.charAt(originalRight-1)
                });
                originalRight--;
                modifiedRight--;
            } else if (
                diffMatrix[originalRight][modifiedRight - 1] >=
                diffMatrix[originalRight - 1][modifiedRight]
            ) {
                segments.push({
                    key: Math.random(),
                    type: "ADD",
                    content: modifiedContent.charAt(modifiedRight-1)
                });
                modifiedRight--;
            } else {
                segments.push({
                    key: Math.random(),
                    type: "DELETE",
                    content: originalContent.charAt(originalRight-1)
                });
                originalRight--;
            }
        }
        while(originalRight > 0) {
            segments.push({
                key: Math.random(),
                type: "DELETE",
                content: originalContent.charAt(originalRight - 1)
            });
            originalRight--;
        }
        while(modifiedRight > 0){
            segments.push({
                key: Math.random(),
                type: "ADD",
                content: modifiedContent.charAt(modifiedRight - 1)
            });
            modifiedRight--;
        }

        console.log({
            sequence: segments.filter(s=>s.type === "NO_CHANGE").map(s=>s.content).reverse().join("")
        })
        return segments.reverse();
    };

    getDiff = (originalContent, modifiedContent) => {
        log("building diffMatrix");
        console.log({
            old: originalContent,
            new: modifiedContent
        });
        const { diffMatrix, sequenceLength } = this.buildDiffMatrix(originalContent, modifiedContent);
        log("diffMatrix", diffMatrix);
        log("sequenceLength", sequenceLength);
        const segments = this.getDiffSegments(originalContent, modifiedContent, diffMatrix);
        log("segments", segments);
        return segments
    };
    getAsLineSegments = (originalContent, modifiedContent) => {
        const oldContentLines = originalContent.split("\n");
        const newContentLines = modifiedContent.split("\n");

        const segments = [];
        for( const [oldLine, newLine ] of zip(oldContentLines, newContentLines)){
            const diff = this.buildDiffMatrix(oldLine, newLine);
            console.log({
                diff,
                oldLineLen :oldLine.length,
                sqlen: diff.sequenceLength
            });

            if(oldLine.length === diff.sequenceLength){
                segments.push({
                    key: Math.random(),
                    type: "NO_CHANGE",
                    content: oldLine
                });
            }else{
                segments.push({
                    key: Math.random(),
                    type: "DELETE",
                    content: oldLine
                });
                segments.push({
                    key: Math.random(),
                    type: "ADD",
                    content: newLine
                });
            }
        }
        return segments;
    }



}

const zip = (a,b) => {
    const parts = [];
    for(let i=0;i< Math.min(a.length, b.length); i++){
        parts.push([ a[i],b[i] ])
    };
    const aLeftOver = a.slice(b.length);
    const bleftOver = b.slice(a.length);

    for(const leftOver of aLeftOver){
        parts.push(
            [leftOver, ""]
        );
    }
    for (const leftOver of bleftOver){
        parts.push( ["",leftOver ] )
    }
    return parts;
}

const log = (TAG, message) => {
    console.log({
        [TAG]:message || '🙉' 
    })
};
