# Gravity Simulation with Express and TypeScript

This project combines TypeScript with a simple gravity simulation using HTML5 Canvas. Users can click to play, and tapping anywhere will generate a falling circle that interacts with Earth-like gravity and can collide with the bottom of the screen. If circles with same color collide they will dissapear. Player should play widely to not fill the whole box with balls, in that case they will lose. If player manage to destroy all the circles having same color will win.

## Getting Started

Follow these steps to run the project locally:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone  https://github.com/Kamagh/Bouncing-Ballz.git

2. Navigate to the project directory:

   ```bash
   cd Bouncing-Ballz

3. Install the dependencies:

   ```bash
   npm install

### Usage

1. Start the development server:
   ```bash
   npm start
    
This will start up a `webpack-dev-server` with auto reloading and watch on. Now any changes you make to file in the `src` directory will trigger a typescript compile and will refresh your app in the browser.


2. Open your web browser and got to http://localhost:8080
3. Click to play, and tap anywhere on the screen to generate falling circles.
4. Enjoy the gravity simulation! Watch as circles fall, bounce, and interact with each other.

### Customization

- Adjust the gravity strength, bounce damping, or any other parameters in the gravity.ts file.
- Modify the project structure or add new features to enhance the simulation.

### Contribution

If you'd like to contribute to the project, feel free to submit pull requests or open issues. Contributions are welcome!


### References

https://github.com/christopher4lis/canvas-boilerplate
https://github.com/JeremySayers/typescript-canvas-template
