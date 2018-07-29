export class Character {
    roomId: String;
    userId: String;
    roomName: String;
    name: String;
    class: String;
    imageUrl: String;
    thumbnailUrl: String;
    colorRGB: String;
    diceCombination: {
        rollName: String;
        dice: {
            type: String;
            amount: Number;
        }[];
        modifier: Number;
    }[];

}
