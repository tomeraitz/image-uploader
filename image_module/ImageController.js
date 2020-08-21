class ImageController {
    constructor(path) {
        this.path = path;
        this.sharp = require("sharp")
        this.authoriseFilles = {
            R0lGODdh: "image/gif",
            R0lGODlh: "image/gif",
            iVBORw0KGgo: "image/png",
            "/9j/": "image/jpg",
        }

    }
    /**
     * 
     * @param {string} path - image path and name
     * @param {Buffer} fille - Buffer fille to upload to server
     * @param {number} imageOrientation - image Orientation : check if the orientation is correct
     */
    async readFile(path, fille, imageOrientation) {
        gc();
        this.sharp.cache(false)
        let data = await this.sharp(fille).metadata()
        if (data.orientation !== imageOrientation) {
            await this.sharp(fille).rotate(360).resize(data.width).toFile(path);
        } else {
            await this.sharp(fille).toFile(path);
        }
        gc();
        return
    }
    /**
     * detectMimeType - check if the file is authorized (only images)
     * @param {sting} base64 - base64 string encoding
     */
    detectMimeType(base64) {
        let answer = ""
        for (let string in this.authoriseFilles) {
            if (base64.indexOf(string) === 0) {
                answer = "O.K";
            }
        }!answer ? answer = "not vaild fille" : null;
        return answer;
    }
    /**
     * addImage - main function of this module
     * @param {object} req - the requrest object
     * @param {sting} imageNmae - the image name
     */
    async addImage(req, imageNmae) {
        let answer = await this.detectMimeType(req.body.base64);
        if (answer === "O.K") {
            const imgdata = JSON.stringify(req.body.base64);
            const buf = Buffer.from(imgdata, 'base64');
            const path = this.path.join(__dirname, '../images/') + imageNmae;
            this.readFile(path, buf, req.body.pictureOrientation)
        }
        return answer;
    }
}

module.exports = ImageController