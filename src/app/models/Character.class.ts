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
        iconName: String;
        rollName: String;
        dice: {
            maxValue: number;
            amount: Number;
        }[];
        modifiers:{
            name: string;
            value: number;
        }[];
    }[] = new Array();
}
