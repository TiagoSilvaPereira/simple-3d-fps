export default class Helper {

    moveObjectTo(object, toPosition, speed = 1) {
        let direction = toPosition.subtract(object.position).normalize(),
            alpha = Math.atan2(-1 * direction.x, -1 * direction.z);

        object.rotation.y = alpha;
        
        object.moveWithCollisions(
            direction.multiplyByFloats(speed, speed, speed)
        );
    }

    moveObjectBackFrom(object, fromPosition, speed = 1) {
        this.moveObjectTo(object, fromPosition, -speed);
    }

}