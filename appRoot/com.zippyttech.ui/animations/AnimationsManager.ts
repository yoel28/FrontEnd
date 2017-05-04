/**
 * Created by zippyttech on 17/12/16.
 */

import {animate, AnimationEntryMetadata, AnimationMetadata, state, style, transition, trigger} from '@angular/core';

import {MetadataStyles} from './MetadataStyles';

export class AnimationsManager {

    public static getTriggers(comand?: string, timeAnimations?: number[] | number): AnimationEntryMetadata[] {
        let triggers: AnimationEntryMetadata[] = [];
        if (comand !== undefined) {
            let animationNames: string[] = comand.toLowerCase().split('-');
            let defaultb: boolean = false;
            if (animationNames[0] === 'd') {
                defaultb = true;
                animationNames.shift();
            }
            animationNames.forEach((name, i) => {
                triggers.push(
                    trigger(
                        (defaultb) ? ('animation_' + i) : name,
                        this.constructMetadata(name, (timeAnimations ? (timeAnimations[i] ? timeAnimations[i] : timeAnimations) : 300))
                    )
                );
            });
        }
        return triggers;
    }

    public static launchAnimation(name: string, state: boolean) {

    }

    private static constructMetadata(comandTrigger: string, timeAnimation?: number): AnimationMetadata[] {
        let effects: string[] = comandTrigger.split('|');

        let styleIn: { [p: string]: string | number } = {};
        let styleOut: { [p: string]: string | number } = {};
        //let keyframes: AnimationKeyframesSequenceMetadata;
        effects.forEach(
            (effect) => {
                styleIn = Object.assign(styleIn, MetadataStyles.getStyle(effect, true));
                styleOut = Object.assign(styleOut, MetadataStyles.getStyle(effect, false));
                //      keyframes = MetadataStyles.getKeyframe(effect,"keyframes");
            }
        );


        return [
            state('true', style(styleIn)),
            state('false', style(styleOut)),
            transition('false <=> true', animate(timeAnimation/*, keyframes*/)),
            transition(':leave', [style(styleIn), animate(timeAnimation/*, keyframes*/)]),
            transition(':enter', [style(styleOut), animate(timeAnimation/*, keyframes*/)])
        ]
    }

}