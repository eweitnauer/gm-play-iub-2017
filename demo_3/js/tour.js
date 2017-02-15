

 $(function () {
        // Instance the tour
    if(typeof(sessionStorage.setVisit)=='undefined' || sessionStorage.setVisit==''){
        sessionStorage.setVisit='yes';

        var tour = new Tour({
            name: 'TourOne',
            steps: [
                {
                    element: "#gm-div",
                    title: "Equation",
                    smartPlacement: true,
                    backdrop: true,
                    content: "This is your equation which you have to solve"
                },
                {
                    element: "#startPauseButton",
                    title: "start",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Click here to start, pause and resume"
                },
                {
                    element: "#timeLeft",
                    title: "Timer",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Timer for the Game"
                },
                {
                    element: "#totalScore",
                    title: "Game Score",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Your Game Score will be displayed here"
                }
            ]/*,
            onEnd: function (tour) {startGame();}*/
        });
        // Initialize the tour
        tour.init();
        // Start the tour
        tour.restart();
    }});
