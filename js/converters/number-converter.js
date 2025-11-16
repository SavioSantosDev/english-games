// Number Converter Functions for Cardinal and Ordinal Numbers
window.gameConverters = {
    // Convert value to answer based on game config
    convertToAnswer: function(value, config) {
        if (config.conversionType === 'cardinal') {
            return this.numberToWords(value);
        } else if (config.conversionType === 'ordinal') {
            return this.numberToOrdinal(value);
        }
        return value.toString();
    },

    // Display value based on game config
    displayValue: function(value, config) {
        if (config.displayType === 'numeric') {
            return value.toLocaleString();
        } else if (config.displayType === 'ordinal-suffix') {
            return this.numberToOrdinalSuffix(value);
        }
        return value.toString();
    },

    // Cardinal number conversion
    numberToWords: function(num) {
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        
        if (num === 0) return 'zero';
        
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
        }
        if (num < 1000) {
            const hundreds = Math.floor(num / 100);
            const remainder = num % 100;
            const hundredText = hundreds === 1 ? 'a hundred' : ones[hundreds] + ' hundred';
            return hundredText + (remainder !== 0 ? ' and ' + this.numberToWords(remainder) : '');
        }
        if (num < 1000000) {
            const thousands = Math.floor(num / 1000);
            const remainder = num % 1000;
            const thousandText = thousands === 1 ? 'a thousand' : this.numberToWords(thousands) + ' thousand';
            return thousandText + (remainder !== 0 ? ' ' + this.numberToWords(remainder) : '');
        }
        if (num < 1000000000) {
            const millions = Math.floor(num / 1000000);
            const remainder = num % 1000000;
            const millionText = millions === 1 ? 'a million' : this.numberToWords(millions) + ' million';
            return millionText + (remainder !== 0 ? ' ' + this.numberToWords(remainder) : '');
        }
        
        return num.toString();
    },

    // Ordinal number conversion
    numberToOrdinal: function(num) {
        const ones = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
        const teens = ['tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 
                      'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
        const tens = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 
                     'sixtieth', 'seventieth', 'eightieth', 'ninetieth'];
        
        if (num === 0) return 'zeroth';
        
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) {
            if (num % 10 === 0) {
                return tens[Math.floor(num / 10)];
            } else {
                const tensPlace = Math.floor(num / 10);
                const onesPlace = num % 10;
                return tens[tensPlace].replace('ieth', 'y-') + ones[onesPlace];
            }
        }
        if (num < 1000) {
            const hundreds = Math.floor(num / 100);
            const remainder = num % 100;
            const hundredText = hundreds === 1 ? 'a hundred' : ones[hundreds] + ' hundred';
            if (remainder === 0) {
                return hundredText + 'th';
            } else {
                return hundredText + ' and ' + this.numberToOrdinal(remainder);
            }
        }
        if (num < 1000000) {
            const thousands = Math.floor(num / 1000);
            const remainder = num % 1000;
            const thousandText = thousands === 1 ? 'a thousand' : this.numberToWords(thousands) + ' thousand';
            
            if (remainder === 0) {
                return thousandText + 'th';
            } else {
                return thousandText + ' ' + this.numberToOrdinal(remainder);
            }
        }
        if (num < 1000000000) {
            const millions = Math.floor(num / 1000000);
            const remainder = num % 1000000;
            const millionText = millions === 1 ? 'a million' : this.numberToWords(millions) + ' million';
            
            if (remainder === 0) {
                return millionText + 'th';
            } else {
                return millionText + ' ' + this.numberToOrdinal(remainder);
            }
        }
        
        return num.toString() + 'th';
    },

    // Add ordinal suffix to number
    numberToOrdinalSuffix: function(num) {
        const lastTwoDigits = num % 100;
        const lastDigit = num % 10;
        
        const formattedNum = num.toLocaleString();
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return formattedNum + 'th';
        }
        
        switch (lastDigit) {
            case 1: return formattedNum + 'st';
            case 2: return formattedNum + 'nd';
            case 3: return formattedNum + 'rd';
            default: return formattedNum + 'th';
        }
    },

    // Normalize answer for comparison
    normalizeAnswer: function(text) {
        return text.toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/,/g, '')
            .replace(/\band\b/g, 'and')
            .replace(/\bone hundred\b/g, 'a hundred')
            .replace(/\bone thousand\b/g, 'a thousand')
            .replace(/\bone million\b/g, 'a million')
            .replace(/\bone hundredth\b/g, 'a hundredth')
            .replace(/\bone thousandth\b/g, 'a thousandth')
            .replace(/\bone millionth\b/g, 'a millionth')
            .replace(/\bone hundred and\b/g, 'a hundred and');
    },

    // Get accepted answer variants
    getAcceptedAnswers: function(correctAnswer, currentValue, gameMode, config) {
        const normalizedCorrect = this.normalizeAnswer(correctAnswer);
        const acceptedAnswers = [normalizedCorrect];
        
        const oneVariant = normalizedCorrect
            .replace(/\ba hundred\b/g, 'one hundred')
            .replace(/\ba thousand\b/g, 'one thousand')
            .replace(/\ba million\b/g, 'one million')
            .replace(/\ba hundredth\b/g, 'one hundredth')
            .replace(/\ba thousandth\b/g, 'one thousandth')
            .replace(/\ba millionth\b/g, 'one millionth')
            .replace(/\ba hundred and\b/g, 'one hundred and');
        
        if (oneVariant !== normalizedCorrect) {
            acceptedAnswers.push(oneVariant);
        }
        
        if (gameMode === 'listening') {
            acceptedAnswers.push(this.displayValue(currentValue, config).toLowerCase());
        }
        
        return acceptedAnswers;
    },

    // Smart random generation for better distribution
    getSmartRandom: function(min, max) {
        if (max <= 100) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        const rand = Math.random();
        
        if (max <= 999999) {
            if (rand < 0.15) return Math.floor(Math.random() * Math.min(99, max)) + 1;
            else if (rand < 0.35) return Math.floor(Math.random() * (Math.min(999, max) - 100 + 1)) + 100;
            else if (rand < 0.70) return Math.floor(Math.random() * (Math.min(99999, max) - 1000 + 1)) + 1000;
            else return Math.floor(Math.random() * (max - 100000 + 1)) + 100000;
        } else {
            if (rand < 0.10) return Math.floor(Math.random() * 99) + 1;
            else if (rand < 0.15) return Math.floor(Math.random() * 900) + 100;
            else if (rand < 0.30) return Math.floor(Math.random() * 98999) + 1000;
            else if (rand < 0.60) return Math.floor(Math.random() * 899999) + 100000;
            else if (rand < 0.85) return Math.floor(Math.random() * 98999999) + 1000000;
            else return Math.floor(Math.random() * (max - 100000000 + 1)) + 100000000;
        }
    }
};
