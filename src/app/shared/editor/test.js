document.addEventListener("DOMContentLoaded", function() {
  const classList = ['btn-blue', 'btn-green', 'btn-red'];
  let counter = -1;

  document.getElementById('btn').addEventListener('click', function() {
    if (counter < classList.length) {
      counter++;
    } else {
      counter = 0;
    }

    this.classList.remove('btn-blue');
    this.classList.remove('btn-green');
    this.classList.remove('btn-red');
    this.classList.add(classList[counter]);

    const normalFunc = function() {
      // Do something;
      console.log('did something!');
    };

    const arrowFunc = () => {
      // Do something;
      console.log('did something!');
    };

    function altFuncDeclaration() {
      // Do something;
      console.log('did something!');
    }

    // normalFunc();
    // arrowFunc();
    // altFuncDeclaration();
  });
});
