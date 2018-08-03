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
        modifiers: {
            name: string;
            value: number;
            attributesReference: string;
        }[];
    }[] = new Array();
    attributes: {
        name: string;
        value: number;
        isCore: boolean;
    }[] = new Array();

    getAttributeModifier(modifier: any) {
        const mod: any = modifier;
        if (modifier.attributesReference) {
            this.attributes.forEach(attr => {
                if (attr.name === modifier.attributesReference) {
                    mod.name = attr.name;
                    mod.value = attr.value;
                }
            });

            if (modifier.name) {
                mod.name = modifier.name;
            }
        }

        return mod;
    }
}
