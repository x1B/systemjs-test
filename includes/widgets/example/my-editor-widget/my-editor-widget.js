/**
 * Copyright 2015 Alexander Wilden
 * Released under the MIT license
 */
import ng from 'angular';
import { object } from 'laxar';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

Controller.$inject = [ '$scope', 'axEventBus' ];

const defaults = {
   htmlTitle: 'A document resource!',
   htmlText: 'This resource is shared by two widgets using the LaxarJS <em>Event-Bus</em>.' +
             '\n\n<b>Try editing</b> the resource contents!'
};

function Controller( $scope, eventBus ) {

   const resource = $scope.features.document.resource;
   eventBus.subscribe( 'didNavigate', () => {
      $scope.model = object.deepClone( defaults );
      eventBus.publish( 'didReplace.' + resource, {
         resource: resource,
         data: $scope.model
      } );
   } );

   // We could also simply use didReplace all the time here.
   // This is just to show how incremental updates can be generated:
   Object.keys( defaults ).forEach( key => {
      $scope.$watch( 'model.' + key, ( newValue, previousValue ) => {
         if( previousValue === undefined ) { return; }
         eventBus.publish( 'didUpdate.' + resource, {
            resource: resource,
            patches: [ { op: 'replace', path: '/' + key, value: newValue } ]
         } );
      } );
   } );

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const name = ng.module( 'myEditorWidget', [] )
   .controller( 'MyEditorWidgetController', Controller )
   .name;
