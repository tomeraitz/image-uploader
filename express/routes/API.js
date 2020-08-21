"use strict"

const ImageUpload = require('../../image_module/ImageController');

class Api {
    constructor(router, path) {
        this.router = router;
        this.path = path;
        this.imageUpload = new ImageUpload(path);
    }
    /**
     * getImage - get Image from server 
     * ! Input - imageName - the name og the image, request looks like http://localhost:8000/images?imageName=image_1586948956767.jpg
     * ! Output - the image
     * TODO : make valid get image request
     */
    getImage() {
        this.router.get('/images', (req, res, next) => {
            let name = req.query.imageName
            const path = this.path.join(__dirname, '../../images/')
            res.status(200).sendFile(`${path}${name}`);
        })
    }
    /**
     * uploadImage - upload image to server
     * ! Input -  request body looks like {"base64":"/9j/....","height":960,"width":1280,"pictureOrientation":1,"deviceOrientation":1}
     * ! Output - the image name
     */
    uploadImage() {
        this.router.post('/upload/image', async (req, res, next) => {
            const imageName = `image_${Date.now()}.jpg`
            let answer = await this.imageUpload.addImage(req, imageName)
            if (answer === "O.K") {
                await res.status(200).send(imageName);
            } else {
                console.error(`${answer}`)
                await res.status(422).send({
                    error: answer
                })
            }
            gc();
            return;
        })
    }
}
module.exports = Api