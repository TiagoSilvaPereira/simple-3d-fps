export default class Weapon {
    
    constructor(level) {

        this.level = level;
        this.scene = level.scene;

        this.fireRate = 1;
        this.canFire = true;
        this.currentFireRate = 0;
    }

    create() {
        this.mesh = this.level.assets.getMesh('shotgun');
        this.mesh.isVisible = true;

        this.mesh.rotationQuaternion = null;
        this.mesh.rotation.y = -Math.PI/2;
        
        this.mesh.parent = this.level.camera;
        this.mesh.position = new BABYLON.Vector3(0.7,-0.45,1.3);
        this.mesh.scaling = new BABYLON.Vector3(2, 2, 2);

        this.controlFireRate();
    }

    fire() {
        var width = this.scene.getEngine().getRenderWidth();
        var height = this.scene.getEngine().getRenderHeight();
        
        // Is the player control enabled?
        if (this.level.controlEnabled) {
            var pickInfo = this.scene.pick(width/2, height/2, null, false, this.camera);
            this.doFire(pickInfo);
        }
    }

    doFire(pickInfo) {
        if (this.canFire) {
            
            if (pickInfo.hit && pickInfo.pickedMesh.name === "enemy") {
                pickInfo.pickedMesh.dispose();
            } else {
                if(pickInfo.pickedPoint) {
                    var b = BABYLON.Mesh.CreateBox("box", 0.1, this.scene);
                    b.position = pickInfo.pickedPoint.clone();
                }
            }
            
            this.animateFire();

            this.canFire = false;
        }
    }

    animateFire() {
        this.level.interpolate(this.mesh.position, 'z', 1, 100);
            
        setTimeout(() => {
            this.level.interpolate(this.mesh.position, 'z', 1.3, 100);
        }, 100);
    }

    controlFireRate() {
        if (!this.canFire) {
            this.currentFireRate -= GAME.engine.getDeltaTime();
            
            if (this.currentFireRate <= 0) {
                this.canFire = true;
                this.currentFireRate = this.fireRate;
            }
        }
    }

}