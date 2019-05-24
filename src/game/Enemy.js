export default class Enemy {

    constructor(level) {
        this.level = level;
        this.scene = level.scene;
        this.mesh = null;

        this.defaultAltitude = 2.5;
        this.maxSpeed = 0.4;

        // this.dieSound = this.level.assets.getSound('robotOff');this.speed

        this.states = {
            'DESTROYED': false
        };
    }

    create() {
        
        this.mesh = this.level.assets.getMesh('enemy').clone();
        this.mesh.enemyObject = this;
        
        BABYLON.Tags.AddTagsTo(this.mesh, 'enemy');

        this.mesh.position.x = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.z = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.y = this.defaultAltitude;

        this.mesh.scaling = new BABYLON.Vector3(0.075, 0.075, 0.075);
        
        this.initSpeed();
        // this.addEnemyMaterial();
        this.generateRandomPosition();

        return this;
    }

    addEnemyMaterial() {
        let meshMaterial = new BABYLON.StandardMaterial('meshMaterial', this.scene);
        if(this.speed < 0.1) {
            meshMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0.8);
        } else if (this.speed < 0.3) {
            meshMaterial.diffuseColor = new BABYLON.Color3(0, 0.8, 0);
        } else {
            meshMaterial.diffuseColor = new BABYLON.Color3(0.8, 0, 0);
        }
        meshMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.mesh.getChildren().forEach(mesh => mesh.material = meshMaterial);
    }

    move() {
        if(this.states.DESTROYED) return;

        let direction = this.randPosition.subtract(this.mesh.position).normalize(),
            alpha = Math.atan2(-1 * direction.x, -1 * direction.z);

        this.mesh.rotation.y = alpha;
        this.mesh.moveWithCollisions(
            direction.multiplyByFloats(this.speed, this.speed, this.speed)
        );
        
        // If is close to the destination, generates a new position
        // console.log(direction)
        if(this.randPosition.subtract(this.mesh.position).length() <= 1) {
            this.generateRandomPosition();
        }this.speed

    }

    initSpeed() {
        this.speed = Math.random();
        this.speed = this.speed <= this.maxSpeed ? this.speed : this.maxSpeed;
    }

    generateRandomPosition() {
        let randomPositionX = Math.floor((Math.random() * 100)) - 50;
        let randomPositionZ = Math.floor((Math.random() * 100)) - 50;
        let altitude = Math.floor(Math.random() * 7);

        this.randPosition = new BABYLON.Vector3(randomPositionX, 5, randomPositionZ);
    }

    destroy() {
        this.states.DESTROYED = true;
        // this.dieSound.play();
        this.level.interpolate(this.mesh.position, 'y', 0.5, 100 * this.mesh.position.y);
        //this.mesh.dispose();
    }

}