class Ingredient {}
class CombinedIngredient {
    Add(ingredient) {
    }
}
var combinedIngredient;
self.addEventListener('message', function (e) {
    var data = e.data;
    var ingredients = data.ingredients;
    combinedIngredient = new CombinedIngredient();
    for (var i = 0; i < ingredients.length; i++) {
        combinedIngredient.Add(ingredients[i]);
    }
    console.log("calculating combination");
    setTimeout(combinationComplete, 2000);
}, false);
function combinationComplete() {
    console.log("combination complete");
    self.postMessage({ event: 'combinationComplete', result: combinedIngredient });
}
