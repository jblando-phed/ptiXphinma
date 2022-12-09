window.onload = () => {
document.getElementById("payment_particular").selectedIndex = 0;
document.getElementById("payment_method").selectedIndex = 0;
 const myInput = document.getElementById('student_number');
 myInput.onpaste = e => e.preventDefault();
}

document.getElementById('student_number').onkeydown = function (e) {
  var value =  e.target.value;
  //only allow a-z, A-Z, digits 0-9 and comma, with only 1 consecutive comma ...
  if (e.key.match(/_/) || !e.key.match(/[\w\d,]/) || (e.key == ',' && value[value.length-1] == ',')) {
    e.preventDefault();
  }
};

function registrarFee(that) {
    if (that.value === "Registrar Fees") {
        document.getElementById("ifRegistrar").style.display = "block";
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
    } else {
        document.getElementById("ifRegistrar").style.display = "none";
    }

    if (that.value === "Other school fees") {
        document.getElementById("ifOthers").style.display = "block";
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
    } else {
        document.getElementById("ifOthers").style.display = "none";
    }

    if (that.value === "Tuition Fee") {
        document.getElementById("ifTuition").style.display = "block";
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
    } else {
        document.getElementById("ifTuition").style.display = "none";
    }

    if (that.value === "Rental") {
        document.getElementById("ifRentalAdd").style.display = "block";
        document.getElementById("ifRentalMonth").style.display = "block";
        document.getElementById("ifRentalYear").style.display = "block";
        document.getElementById("ifRentalButton").style.display = "block";
    } else {
        document.getElementById("ifRentalAdd").style.display = "none";
        document.getElementById("ifRentalMonth").style.display = "none";
        document.getElementById("ifRentalYear").style.display = "none";
    }


}

function onlyNumberKey(evt) {

    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}



function addRental(that) {
    that.preventDefault();
    if (that.value === 2) {
        document.getElementById("ifRentalAmountTwo").style.display = "block";
        document.getElementById("ifRentalMonthTwo").style.display = "block";
        document.getElementById("ifRentalYearTwo").style.display = "block";
        document.getElementById("ifRentalButton").style.display = "block";
        document.getElementById("ifRentalRemove").style.display = "block";
        document.getElementById("ifRentalRemoveButton").style.display = "block";
    } else {
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
    }

     if (that.value === 3) {
        document.getElementById("ifRentalAmountThree").style.display = "block";
        document.getElementById("ifRentalMonthThree").style.display = "block";
        document.getElementById("ifRentalYearThree").style.display = "block";
        document.getElementById("ifRentalButton").style.display = "block";
        document.getElementById("ifRentalRemove").style.display = "block";
        document.getElementById("ifRentalRemoveButton").style.display = "block";
    } else {
        document.getElementById("ifRentalAmountThree").style.display = "none";
        document.getElementById("ifRentalMonthThree").style.display = "none";
        document.getElementById("ifRentalYearThree").style.display = "none";
    }
}

function removeRental(that) {
    if (that.value < 2) {
        event.preventDefault();
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
        document.getElementById("ifRentalButton").style.display = "block";
        document.getElementById("ifRentalRemove").style.display = "block";
        document.getElementById("ifRentalRemoveButton").style.display = "none";
    } else {
        document.getElementById("ifRentalAmountTwo").style.display = "none";
        document.getElementById("ifRentalMonthTwo").style.display = "none";
        document.getElementById("ifRentalYearTwo").style.display = "none";
    }

    if (that.value < 3) {
        document.getElementById("ifRentalAmountThree").style.display = "none";
        document.getElementById("ifRentalMonthThree").style.display = "none";
        document.getElementById("ifRentalYearThree").style.display = "none";
        document.getElementById("ifRentalButton").style.display = "block";
        document.getElementById("ifRentalRemove").style.display = "block";
        document.getElementById("ifRentalRemoveButton").style.display = "block";
    }
}

function paymentTerms(that) {
    if (that.value === "Installment") {
        document.getElementById("ifInstallment").style.display = "block";
    } else {
        document.getElementById("ifInstallment").style.display = "none";
    }
}


function InputMask(element) {
    var self = this;

    self.element = element;

    self.mask = element.attributes["input-mask"].nodeValue;

    self.inputBuffer = "";

    self.cursorPosition = 0;

    self.bufferCursorPosition = 0;

    self.dataLength = getDataLength();

    function getDataLength() {
        var ret = 0;

        for (var i = 0; i < self.mask.length; i++) {
            if (self.mask.charAt(i) == " ") {
                ret++;
            }
        }

        return ret;
    }

    self.keyEventHandler = function (obj) {
        obj.preventDefault();

        self.updateBuffer(obj);
        self.manageCursor(obj);
        self.render();
        self.moveCursor();
    }

    self.updateBufferPosition = function () {
        var selectionStart = self.element.selectionStart;
        self.bufferCursorPosition = self.displayPosToBufferPos(selectionStart);
        console.log("self.bufferCursorPosition==" + self.bufferCursorPosition);
    }

    self.onClick = function () {
        self.updateBufferPosition();
    }

    self.updateBuffer = function (obj) {
        if (obj.keyCode == 8) {
            self.inputBuffer = self.inputBuffer.substring(0, self.bufferCursorPosition - 1) + self.inputBuffer.substring(self.bufferCursorPosition);
        } else if (obj.keyCode == 46) {
            self.inputBuffer = self.inputBuffer.substring(0, self.bufferCursorPosition) + self.inputBuffer.substring(self.bufferCursorPosition + 1);
        } else if (obj.keyCode >= 37 && obj.keyCode <= 40) {
            //do nothing on cursor keys.
        } else {
            var selectionStart = self.element.selectionStart;
            var bufferCursorPosition = self.displayPosToBufferPos(selectionStart);
            self.inputBuffer = self.inputBuffer.substring(0, bufferCursorPosition) + String.fromCharCode(obj.which) + self.inputBuffer.substring(bufferCursorPosition);
            if (self.inputBuffer.length > self.dataLength) {
                self.inputBuffer = self.inputBuffer.substring(0, self.dataLength);
            }
        }
    }

    self.manageCursor = function (obj) {
        console.log(obj.keyCode);
        if (obj.keyCode == 8) {
            self.bufferCursorPosition--;
        } else if (obj.keyCode == 46) {
            //do nothing on delete key.
        } else if (obj.keyCode >= 37 && obj.keyCode <= 40) {
            if (obj.keyCode == 37) {
                self.bufferCursorPosition--;
            } else if (obj.keyCode == 39) {
                self.bufferCursorPosition++;
            }
        } else {
            var bufferCursorPosition = self.displayPosToBufferPos(self.element.selectionStart);
            self.bufferCursorPosition = bufferCursorPosition + 1;
        }
    }

    self.setCursorByBuffer = function (bufferCursorPosition) {
        var displayCursorPos = self.bufferPosToDisplayPos(bufferCursorPosition);
        self.element.setSelectionRange(displayCursorPos, displayCursorPos);
    }

    self.moveCursor = function () {
        self.setCursorByBuffer(self.bufferCursorPosition);
    }

    self.render = function () {
        var bufferCopy = self.inputBuffer;
        var ret = {
            muskifiedValue: ""
        };

        var lastChar = 0;

        for (var i = 0; i < self.mask.length; i++) {
            if (self.mask.charAt(i) == " " &&
                bufferCopy) {
                ret.muskifiedValue += bufferCopy.charAt(0);
                bufferCopy = bufferCopy.substr(1);
                lastChar = i;
            } else {
                ret.muskifiedValue += self.mask.charAt(i);
            }
        }

        self.element.value = ret.muskifiedValue;

    }

    self.preceedingMaskCharCount = function (displayCursorPos) {
        var lastCharIndex = 0;
        var ret = 0;

        for (var i = 0; i < self.element.value.length; i++) {
            if (self.element.value.charAt(i) == " "
                || i > displayCursorPos - 1) {
                lastCharIndex = i;
                break;
            }
        }

        if (self.mask.charAt(lastCharIndex - 1) != " ") {
            var i = lastCharIndex - 1;
            while (self.mask.charAt(i) != " ") {
                i--;
                if (i < 0) break;
                ret++;
            }
        }

        return ret;
    }

    self.leadingMaskCharCount = function (displayIndex) {
        var ret = 0;

        for (var i = displayIndex; i >= 0; i--) {
            if (i >= self.mask.length) {
                continue;
            }
            if (self.mask.charAt(i) != " ") {
                ret++;
            }
        }

        return ret;
    }

    self.bufferPosToDisplayPos = function (bufferIndex) {
        var offset = 0;
        var indexInBuffer = 0;

        for (var i = 0; i < self.mask.length; i++) {
            if (indexInBuffer > bufferIndex) {
                break;
            }

            if (self.mask.charAt(i) != " ") {
                offset++;
                continue;
            }

            indexInBuffer++;
        }
        var ret = bufferIndex + offset;

        return ret;
    }

    self.displayPosToBufferPos = function (displayIndex) {
        var offset = 0;
        var indexInBuffer = 0;

        for (var i = 0; i < self.mask.length && i <= displayIndex; i++) {
            if (indexInBuffer >= self.inputBuffer.length) {
                break;
            }

            if (self.mask.charAt(i) != " ") {
                offset++;
                continue;
            }

            indexInBuffer++;
        }

        return displayIndex - offset;
    }

    self.getValue = function () {
        return this.inputBuffer;
    }
    self.element.onkeypress = self.keyEventHandler;
    self.element.onclick = self.onClick;
}

function InputMaskManager() {
    var self = this;

    self.instances = {};

    self.add = function (id) {
        var elem = document.getElementById(id);
        var maskInstance = new InputMask(elem);
        self.instances[id] = maskInstance;
    }

    self.getValue = function (id) {
        return self.instances[id].getValue();
    }

    document.onkeydown = function (obj) {
        if (obj.target.attributes["input-mask"]) {
            if (obj.keyCode == 8 ||
                obj.keyCode == 46 ||
                (obj.keyCode >= 37 && obj.keyCode <= 40)) {

                if (obj.keyCode == 8 || obj.keyCode == 46) {
                    obj.preventDefault();
                }

                //needs to broadcast to all instances here:
                var keys = Object.keys(self.instances);
                for (var i = 0; i < keys.length; i++) {
                    if (self.instances[keys[i]].element.id == obj.target.id) {
                        self.instances[keys[i]].keyEventHandler(obj);
                    }
                }
            }
        }
    }
}

//Initialize an instance of InputMaskManager and
//add masker instances by passing in the DOM ids
//of each HTML counterpart.
var maskMgr = new InputMaskManager();
maskMgr.add("student_number");

function showValue_student_number() {
    //-------------------------------------------------------__Value_Here_____
    document.getElementById("console_student_number").value = maskMgr.getValue("student_number");
}