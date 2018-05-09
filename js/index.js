var searchInput = document.getElementById("search"); // record search field input, global
var selectedIndex;

document
  .querySelector("form.search-field")
  .addEventListener("keyup", function(e) {
    e.preventDefault();

    var searchTerms = searchInput.value.split(" ").join("+"); // format search field input for API call

    $.ajax({
      url: "//en.wikipedia.org/w/api.php", // wiki api
      data: {
        action: "query",
        list: "search",
        srsearch: searchTerms,
        format: "json",
        formatversion: 1
      },
      dataType: "jsonp",
      success: function suggestions(data) {
        // search suggestion results
        var title1 = data.query.search[0].title;
        var title2 = data.query.search[1].title;
        var title3 = data.query.search[2].title;
        var title4 = data.query.search[3].title;
        var title5 = data.query.search[4].title;
        // search suggestion result display
        document.getElementById("sugg0Field").innerHTML = title1;
        document.getElementById("sugg1Field").innerHTML = title2;
        document.getElementById("sugg2Field").innerHTML = title3;
        document.getElementById("sugg3Field").innerHTML = title4;
        document.getElementById("sugg4Field").innerHTML = title5;
      }
    });
  });
// update text input after clicking search suggestion
function suggSelect(p) {
  document.getElementById("search").value = document.getElementById(
    "sugg" + p + "Field"
  ).innerHTML;
  selectedIndex = p;
  document.getElementById("suggField").style.display = "none";
}

function showSuggs() {
  // show-hide suggestion field div drop down
  var x = document.getElementById("search").value;
  if (x.length == 0) {
    document.getElementById("suggField").style.display = "none";
  } else if (x.length > 1) {
    document.getElementById("suggField").style.display = "block";
  }
}

var submitted = document.getElementById("srchBtn"); // get submit button

submitted.onclick = function(event) {
  // onclick submit
  event.preventDefault();

  var searchSubmit = document.getElementById("search");
  var searchFinal = searchSubmit.value.toString(); // call and cleanup search text

  console.log(searchFinal);

  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    data: {
      format: "json",
      action: "parse",
      page: searchFinal,
      prop: "text",
      section: 0
    },
    dataType: "jsonp",
    success: function(data) {
      console.log(data);
      //      $("#article").html(data.parse.text["*"])

      var markup = data.parse.text["*"]; // call article text
      var i = $("<div></div>").html(markup);

      // remove links as they will not work
      i.find("a").each(function() {
        $(this).replaceWith($(this).html());
      });

      // remove any references
      i.find("sup").remove();

      // remove cite error
      i.find(".mw-ext-cite-error").remove();

      $("#article").html($(i).find("p"));

      var title = data.parse.title; // get and display title
      document.getElementById("titleField").innerHTML = title + ":";

      document.getElementById("resultLink").innerHTML =
        "<b>To see the full Wikipedia Article, click " +
        "<a href='https://en.wikipedia.org/wiki/" +
        title +
        "' target='_blank''>Here!</a></b>";

      document.getElementById("suggField").style.display = "none";
    }
  });
};