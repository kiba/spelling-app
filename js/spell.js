// Generated by CoffeeScript 1.9.3
(function() {
  $(function() {
    var emptyInput, randomLetter, random_question, startUp, update_keyHandler, update_question, words;
    $("#question, #answer").hide();
    words = $.getJSON("spellings.json");
    $.when(words).done((function(d) {
      return startUp(d);
    }));
    $.when(words).fail(function(data, status, error) {
      console.log(status + error);
    });
    startUp = function(data) {
      $("#question, #answer").show();
      this.current = "";
      this.fail = 0;
      this.reveal = "";
      update_question(data);
      return this.data = data;
    };
    random_question = function(data) {
      var choice, i, ref, results;
      choice = Math.floor(Math.random() * data['words'].length);
      this.current = data['words'][choice]['name'];
      (function() {
        results = [];
        for (var i = 1, ref = this.current.length; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this).forEach(function() {
        return this.reveal = this.reveal.concat("_");
      });
      return data['words'][choice];
    };
    update_question = function(data) {
      var entry, size;
      entry = random_question(data);
      update_keyHandler();
      size = entry.name.length;
      $("dd#hint_stat").empty().append("This word is " + size + " letters long.");
      $("dd#hint_define").empty().append(entry['hint']);
      return $("dd#hint_sentence").empty().append(entry['example']);
    };
    emptyInput = function() {
      return $("input#input_answer").val("");
    };
    randomLetter = function() {
      var breaking, i, n, positions, ref, results;
      if (this.reveal === this.current) {
        return;
      }
      breaking = 0;
      positions = (function() {
        results = [];
        for (var i = 1, ref = this.current.length - 1; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this);
      while (breaking < 500) {
        breaking += 1;
        n = Math.floor(Math.random() * this.current.length);
        if (this.reveal[n] === "_") {
          this.reveal = this.reveal.substring(0, n) + this.current[n] + this.reveal.substring(n + 1);
          return;
        }
      }
    };
    return update_keyHandler = function() {
      $("#input_answer").off();
      return $("#input_answer").keydown((function(_this) {
        return function(e) {
          var attempt, last;
          if (e.which === 13) {
            attempt = $("#input_answer").val();
            if (attempt.toLowerCase() === _this.current.toLowerCase()) {
              $(".alert").addClass("alert-success");
              $(".alert").empty().append("You had just spelt the word " + _this.current + " right!");
              update_question(_this.data);
              return emptyInput();
            } else {
              _this.fail += 1;
              $(".alert").addClass("alert-danger");
              if (_this.fail > 1) {
                last = " times.";
              } else {
                last = " time.";
              }
              if (_this.fail % 2 === 0) {
                randomLetter();
              }
              $(".alert").empty().append("You have failed " + _this.fail + last);
              return emptyInput();
            }
          }
        };
      })(this));
    };
  });

}).call(this);
