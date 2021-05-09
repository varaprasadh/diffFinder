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

        while (originalRight >= 0 && modifiedRight >= 0) {
            if (
                originalContent.charAt(originalRight) ===
                modifiedContent.charAt(modifiedRight)
            ) {
                segments.push({
                    key:Math.random(),
                    type: "NO_CHANGE",
                    content: originalContent.charAt(originalRight)
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
                    content: modifiedContent.charAt(modifiedRight)
                });
                modifiedRight--;
            } else {
                segments.push({
                    key: Math.random(),
                    type: "DELETE",
                    content: originalContent.charAt(originalRight)
                });
                originalRight--;
            }
        }
        return segments.reverse();
    };

    getDiff = (originalContent, modifiedContent) => {
        const { diffMatrix } = this.buildDiffMatrix(originalContent, modifiedContent);
        const segments = this.getDiffSegments(originalContent, modifiedContent, originalContent.length, modifiedContent.length, diffMatrix);
        return segments
    }

}


