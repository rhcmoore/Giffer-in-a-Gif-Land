// Topics to be displayed in initial buttons
$( document ).ready(function() {

    // get list of buttons from previous queries
    var list = JSON.parse(localStorage.getItem("queryList"));
    // if it's empty, set list to an empty array
    if (!Array.isArray(list)) {
        list = [];
    };
    console.log(list);

    // Initial buttons to be displayed
    var topics = ["Family", "Texas", "Computer"];

    // Combine prior queries with hardcoded ones
    topics = topics.concat(list);

    // Loop through topics array to create buttons
    function updateButtons() {
        $("#buttonDisplay").empty();
        for (var i = 0; i < topics.length; i++) {
            // create new caption
            var newCaption = $("<div>").text(topics[i]).addClass("button-caption");
            // create new black space
            var newBlackSpace = $("<div>").addClass("black-space");
            // create new button
            var newButton = $("<button>").data("name", topics[i]).addClass("topic-button");
            // append caption to button
            newButton.append(newBlackSpace, newCaption);
            // append it to the display
            $("#buttonDisplay").append(newButton);
        };
    };
    
    // On button click, get 10 static gif images and place them in the display
    $(document).on("click", ".topic-button", function(){
        // empty gif display
        $("#gifDisplay").empty();
        // create query URL from search term
        queryURL = "https://api.giphy.com/v1/gifs/search?api_key=Yi0ZBLUqIQY8KsEeCmFhpk0E7l2qD94u&limit=11&q=" + $(this).data("name");
        // AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response.data);
            // for each item in response
            for (var i = 1; i<11; i++) {
                // select new card elements 
                var newCard = $("<div>").addClass("card text-center");
                var newCardBody = $("<div>").addClass("card-body");
                var newGif = $("<img>").attr("src", response.data[i].images.fixed_width_still.url).data("still",response.data[i].images.fixed_width_still.url).data("animate", response.data[i].images.fixed_width.url).data("state", "still").addClass("gif card-img-top");
                var randomYear = Math.floor(Math.random() * 38) + 1980;
                var imageTitle = $("<p>").text(response.data[i].title.split(' GIF')[0] + " (" + randomYear + ")").addClass("card-text");
                // append title, git, and card body to the card
                newCardBody.append(imageTitle);
                newCard.append(newGif, newCardBody);
                // add skew to card
                var skewAmount = Math.floor(Math.random() * 8)  - 4;
                newCard.css("transform", "rotate(" + skewAmount + "deg)");
                // append the card to the display
                $("#gifDisplay").append(newCard);
            };
        });
    });

    // Handling start/stop animation on clicks of images/gifs
    $(document).on("click", ".gif", function() {
        // get the image state (still or animate)
        var state = $(this).data("state");
        // if it's still, make it animated
        if (state === "still") {
            $(this).attr("src", $(this).data("animate"));
            $(this).data("state", "animate");
        // if it's animated, make it still
        } else if (state === "animate") {
            $(this).attr("src", $(this).data("still"));
            $(this).data("state", "still");
        };
    });

    // Functionality to add new buttons to starting topics
    $(document).on("click", "#submit-button", function() {
        event.preventDefault();
        // if it's not empty
        if ($("#new-button-input").val()) {
            var inputValue = $("#new-button-input").val();
            console.log(inputValue);

            // Logic for local storage
            // When the submit button is clicked
                // GET string from local storage 
                // JSON.parse() turns it into a list
                var storageList = JSON.parse(localStorage.getItem("queryList"));

                // If there are no values, set storageList to an empty array
                if (!Array.isArray(storageList)) {
                    storageList = [];
                };
                // Push submit.val() in to the list
                list.push(inputValue);
                // JSON.stringify turns it into a string
                // SET local storage again
                localStorage.setItem("queryList", JSON.stringify(list));

            $("#new-button-input").attr("placeholder", "Click new " + inputValue + " button for more!");
            // Display first result in polaroid
            queryURL = "https://api.giphy.com/v1/gifs/search?api_key=Yi0ZBLUqIQY8KsEeCmFhpk0E7l2qD94u&limit=1&q=" + inputValue;
            // AJAX call
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                $(".polaroid-image").empty();
                console.log(response.data);
                // select new Polaroid elements 
                var newPolaroid = $("<img>").attr("src", response.data[0].images.fixed_width_still.url).data("still",response.data[0].images.fixed_width_still.url).data("animate", response.data[0].images.fixed_width.url).data("state", "still").addClass("polaroid-gif gif");
                // adjust height of box
                $(".polaroid-image").css("height", "auto");
                // append the gif to the display
                $(".polaroid-image").append(newPolaroid);
            });

            // Add button to topics
            topics.push($("#new-button-input").val());
            $("#new-button-input").val("");
            updateButtons();

        };
    });

    updateButtons();
});