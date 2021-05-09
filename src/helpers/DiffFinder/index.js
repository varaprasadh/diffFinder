export default class DiffFinder {

    buildDiffMatrix = (original, modified) => {
        const rows = original.length;
        const cols = modified.length;

        const matrix = Array.from(new Array(rows+1)).map(_ => {
            return Array.from(new Array(cols+1)).map(i => 0);
        });

        for (let originalLeft = 1; originalLeft <= rows; originalLeft++){
            for(let modifiedLeft = 1; modifiedLeft <=cols; modifiedLeft++ ){
                if(original.charAt(originalLeft) === modified.charAt(modifiedLeft)){
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
            sequenceLength: matrix[rows][cols]
        }
 
    }

    getDiffSegments = (
        originalContent,
        modifiedContent,
        originalRight,
        modifiedRight,
        diffMatrix
    ) => {
        let segments = [];

        while (originalRight > 0 || modifiedRight > 0) {
            while( originalRight <= 0 && modifiedRight > 0 ){
                segments.push({
                    key: Math.random(),
                    type: "ADD",
                    content: modifiedContent.charAt(modifiedRight - 1)
                });
                modifiedRight--;
            }
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
        return segments.reverse();
    };

    getDiff = (originalContent, modifiedContent) => {
        log("building diffMatrix");
        const { diffMatrix, sequenceLength } = this.buildDiffMatrix(originalContent, modifiedContent);
        log("diffMatrix", diffMatrix);
        log("sequenceLength", sequenceLength);
        const segments = this.getDiffSegments(originalContent, modifiedContent, originalContent.length, modifiedContent.length, diffMatrix);
        log("segments", segments);
        return segments
    }

}

const log = (TAG, message) => {
    console.log({
        [TAG]:message || '🙉' 
    })
};
