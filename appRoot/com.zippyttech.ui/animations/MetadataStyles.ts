/**
 * Created by zippyttech on 19/12/16.
 */

import {AnimationKeyframesSequenceMetadata} from '@angular/core';


export class MetadataStyles {
    public static getStyle(effect: string, state: boolean): { [p: string]: string | number } {
        let style: { [p: string]: string | number } = {};

        switch (effect) {
            case 'fade'         :
                style = state ? {} : {opacity: '0'};
                break;
            case 'expand_down'  :
                style = state ? {} : {height: '0'};
                break;
            case 'expand_right' :
                style = state ? {} : {width: '0'};
                break;
            case 'slide_down'     :
                style = state ? {} : {transform: 'translateY(-100%)'};
                break;
            case 'slide_up'   :
                style = state ? {} : {transform: 'translateY(+100%)'};
                break;
            case 'slide_left'   :
                style = state ? {} : {transform: 'translateX(-100%)'};
                break;
            case 'slide_right'  :
                style = state ? {} : {transform: 'translateX(+100%)'};
                break;
            case 'turn_left'    :
                style = state ? {} : {'transform-origin': 'left', transform: 'rotateY(90deg)'};
                break;
        }
        return style;
    }

    public static getKeyframe(keyframeName: string, type: string): AnimationKeyframesSequenceMetadata {
        return;
    }

}