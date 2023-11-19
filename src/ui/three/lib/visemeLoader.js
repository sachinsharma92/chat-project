import { NumberKeyframeTrack } from 'three';

const visemeIdOffset = 53;

export class visemeLoader {

    constructor( jsonFile, mesh, myCallBack ) {

        async function solver( myjsonFile ) {

            const myPromise = new Promise( ( resolve ) => {

                const xmlhttp = new XMLHttpRequest();
                xmlhttp.onload = function () {

                    const myObj = JSON.parse( this.responseText );
                    resolve( myObj );

                };

                xmlhttp.open( 'GET', myjsonFile );
                xmlhttp.send();

            } );

            const myData = await myPromise.then( value =>{

                return value;

            } );

            return myData;

        }

        solver( jsonFile ).then( value => {

            const visemes = value.visemes;

            const trackTimes = [];
            const trackValues = [];

            const morphDict = mesh.morphTargetDictionary;

            const shapeKeyLength = Object.getOwnPropertyNames( morphDict ).length;

            const myName = mesh.name.concat( '.morphTargetInfluences' );

            for ( var i = 0; i < visemes.length; i ++ ) {

                for ( var j = 0; j < shapeKeyLength; j ++ ) {

                    var amplitude = 1;

                    if ( i < visemes.length - 1 ) {

                    var temp = visemes[ i + 1 ].AudioOffset - visemes[ i ].AudioOffset;
                    amplitude = temp > 100 ? 1 : temp / 100;

                    }

                    var value = visemes[ i ].VisemeId + visemeIdOffset == j ? amplitude : 0;

                    value = j == 53 ? 0 : value;
                    trackValues.push( value );

                }

                var duration = visemes[ i ].AudioOffset;
                trackTimes.push( duration );

            }

            this.track = new NumberKeyframeTrack( myName, trackTimes, trackValues );
            this.timeLaps = this.track.times[ this.track.times.length - 1 ];

            myCallBack();

        } );

    }

}
