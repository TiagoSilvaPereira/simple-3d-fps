export default class Enemy {

    constructor(level) {
        this.level = level;
        this.scene = level.scene;
        this.mesh = null;
    }

    create() {
        this.mesh = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 1.5, segments: 2}, this.scene);

        this.mesh.position.x = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.z = Math.floor((Math.random() * 100)) - 50;
        this.mesh.position.y = 2;

        this.addEnemyMaterial();

        return this;
    }

    addEnemyMaterial() {
        this.meshMaterial = new BABYLON.StandardMaterial('meshMaterial', this.scene);
        this.meshMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#6ab04c');
        this.meshMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.mesh.material = this.meshMaterial;
    }

}