// DESCRIPTION
// View-Scripts should tell which Components there are and can
// define Variables which later can be used inside those Components.

// View-Specific Variables
var v_title = "Main";
var v_subtitle = "You are about to use a powerful framework using vanilla JS (plain old JavaScript) and JQuery.";

// Get the View's components
kjs.get_components([
    ['','default-head'],
    ['bootstrapTemplate','navigation'],
    ['bootstrapTemplate','header'],
    ['bootstrapTemplate','title'],
    ['bootstrapTemplate','footer'],
//  ['Component-Collection', 'Component'],
]);
