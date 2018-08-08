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
        isSaveThrow: boolean;
        attributesReference: string[];
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

    getStandardDnDCharacterTemplate(){
        let characterTemplate = new Character();
        //Attributes
        characterTemplate.attributes.push({
            name: 'Prf',
            value: 0,
            isCore: false,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Str',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Dex',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Con',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Int',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Wis',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        characterTemplate.attributes.push({
            name: 'Cha',
            value: 0,
            isCore: true,
            isSaveThrow: false,
            attributesReference: []
        });
        
        //Skills
    }
    //Add skill
}
