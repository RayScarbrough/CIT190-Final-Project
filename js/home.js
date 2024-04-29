$(document).ready(function () {
  $(".dot").click(function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    const slideIndex = $(this).attr("data-slide"); // Get the slide index
    const containerWidth = $(".slider-wrapper").width(); // Get the width of the slider container
    $(".slider").animate(
      {
        // Use jQuery to animate the slider's scrollLeft property
        scrollLeft: containerWidth * slideIndex,
      },
      300
    );
  });

  // Set up event listeners for play buttons
  document.getElementById("SnakeGame").addEventListener("click", function () {
    window.location.href = "Snake.html";
  });
  document.getElementById("blackJack").addEventListener("click", function () {
    window.location.href = "blackJack.html";
  });
  document.getElementById("BirdBlitz").addEventListener("click", function () {
    window.location.href = "BirdBlitz.html";
  });
});
