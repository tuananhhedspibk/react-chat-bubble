'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Parser = require('html-react-parser');

var _fontAwesome = require('react-fontawesome');

var _emoji = require('emoji-mart');

require('./ChatBubble.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChatBubble = function (_Component) {
  _inherits(ChatBubble, _Component);

  function ChatBubble() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ChatBubble);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ChatBubble.__proto__ || Object.getPrototypeOf(ChatBubble)).call.apply(_ref, [this].concat(args))), _this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChatBubble, [{
    key: 'getConversations',
    value: function getConversations(messages) {
      if (messages == undefined) {
        return;
      }

      var listItems = messages.map(function (message, index) {
        var bubbleClass = 'you';
        var bubbleDirection = '';

        if (message.type === 0) {
          bubbleClass = 'me';
          bubbleDirection = "bubble-direction-reverse";
        }

        let text = '';
        let isImageTag = false;
        let elements = [];
        let allIsEmoji = true;
        
        if (message.contentType != '') {
          if (message.contentType.indexOf('image') !== -1) {
            isImageTag = true;
            let width = 0, height = 0;
            if (parseFloat(message.width) > 500 || parseFloat(message.height) > 500 ) {
              var ratio = parseFloat(message.width) / parseFloat(message.height);
              var ratioForWidth = parseFloat(message.width) / 450;
              var ratioForHeight = parseFloat(message.width) / 500;
              if(ratioForHeight > 1 && ratioForWidth <= 1 ) {
                height = 500;
                width = height * ratio;
              }
              else{
                width = 450;
                height = width / ratio;
              }
            }
            else {
              width = parseFloat(message.width);
              height = parseFloat(message.height);
            }
            text = '<img src="' + message.downloadURL + '" style="width: '+
              width.toString() + 'px; height: ' + height.toString() +'px; border-radius: 15px">';
          }
          else {
            text = '<i class="fa fa-cloud-download" aria-hidden="true"></i>' +
            '<a target="_blank" href="' + message.downloadURL + '">'
            + message.name + '</a>';
          }
        }
        else {
          let regex = new RegExp('(^|\\s)(\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?)', 'g');
          let match;
          let root = 0;
          let lastString = '';
          let colons = '';
          let colonsCore = '';
          while (match = regex.exec(message.text)) {
            var textobj = new Object();
            var emoji = new Object();
            if (message.text.substring(root, match.index + 1) != ':') {
              textobj.type = 'text';
              textobj.text = message.text.substring(root, match.index + 1);
              elements.push(textobj);
            }
            root = match.index + match[2].length + 1;
            colons = match[2];
            colonsCore = colons.substring(1, colons.length - 1);
            var emojiSearchResult = _emoji.emojiIndex.search(colonsCore);
            if (emojiSearchResult.length > 0){
              emojiSearchResult.map(element => {
                if(element.colons == colons) {
                  emoji.type = 'emoji';
                  emoji.emoji = colons;
                  elements.push(emoji);
                }
              })
            }
            else {
              var textobj = new Object();
              textobj.type = 'text';
              textobj.text = colons;
              elements.push(textobj);
            }
            if ((match.index + match[2].length + 1) <  message.text.length) {
              lastString = message.text.substring(match.index + match[2].length + 1,
                message.text.length);
            }
            else {
              lastString = '';
            }
          }
          if (lastString != '') {
            let textobj = new Object();
            textobj.type = 'text';
            textobj.text = lastString;
            elements.push(textobj);
          }
          if (elements.length != 0){
            elements.map(element => {
              if (element.type == 'text') {
                var tempStr = element.text;
                if (tempStr.replace(/\s/g, '').length) {
                  allIsEmoji = false;
                }
              }
            })
          }
        }

        let timeStamp = new Date(parseFloat(message.msg_ts));
        var options = {
          weekday: 'long', year: 'numeric', month: 'short',  
          day: 'numeric', hour: '2-digit', minute: '2-digit'
        };
        let timeFormatted = timeStamp.toLocaleDateString('vi-VN', options);

        if (text != '') {
          if (isImageTag) {
            return _react2.default.createElement(
              'div',
              { className: 'bubble-container ' + bubbleDirection, key: index },
              _react2.default.createElement('img', { className:
                'img-circle ' + bubbleClass, src: message.image }),
              _react2.default.createElement(
                'div',
                { id: message._id, className: 'bubble-img img-' + bubbleClass },
                _Parser(text)
              ),
              _react2.default.createElement(
                'div',
                { className: 'hashtag-box' }
              ),
              _react2.default.createElement(
                'div',
                { className: 'time-' + bubbleClass },
                timeFormatted
              )
            );
          }
          return _react2.default.createElement(
            'div',
            { className: 'bubble-container ' + bubbleDirection, key: index },
            _react2.default.createElement('img', { className:
              'img-circle ' + bubbleClass, src: message.image }),
            _react2.default.createElement(
              'div',
              { id: message._id, className: 'bubble-link bubble ' + bubbleClass },
              _Parser(text)
            ),
            _react2.default.createElement(
              'div',
              { className: 'hashtag-box' }
            ),
            _react2.default.createElement(
              'div',
              { className: 'time-' + bubbleClass },
              timeFormatted
            )
          );
        }
        else {
          if(elements.length > 0) {
            if(!allIsEmoji) {
              return _react2.default.createElement(
                'div',
                { className: 'bubble-container ' + bubbleDirection, key: index },
                _react2.default.createElement('img', { className: 'img-circle ' + bubbleClass,
                  src: message.image }),
                _react2.default.createElement(
                  'div',
                  { id: message._id, className: 'bubble ' + bubbleClass },
                  elements.map(element => {
                    if(element.type == 'emoji') {
                      return(
                        _react2.default.createElement(
                          _emoji.Emoji,
                          {emoji: element.emoji, size: 20, set: 'messenger'}
                        )
                      )
                    }
                    else {
                      return(
                        _react2.default.createElement(
                          'div',
                          { className: 'text-content' },
                          element.text
                        )
                      )
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'hashtag-box' }
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'time-' + bubbleClass },
                  timeFormatted
                )
              );
            }
            else {
              return _react2.default.createElement(
                'div',
                { className: 'bubble-container ' + bubbleDirection, key: index },
                _react2.default.createElement('img', { className: 'img-circle '
                  + bubbleClass, src: message.image }),
                _react2.default.createElement(
                  'div',
                  { className: 'bubble-emoji' },
                  elements.map(element => {
                    if(element.type == 'emoji') {
                      return(
                        _react2.default.createElement(
                          _emoji.Emoji,
                          {emoji: element.emoji, size: 30, set: 'messenger'}
                        )
                      )
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'time-' + bubbleClass },
                  timeFormatted
                )
              );
            }
          }
          return _react2.default.createElement(
            'div',
            { className: 'bubble-container ' + bubbleDirection, key: index },
            _react2.default.createElement('img', { className: 'img-circle '
              + bubbleClass, src: message.image }),
            _react2.default.createElement(
              'div',
              { id: message._id, className: 'bubble ' + bubbleClass },
              _react2.default.createElement(
                'p',
                { className: 'text-content' },
                message.text
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'hashtag-box' }
            ),
            _react2.default.createElement(
              'div',
              { className: 'time-' + bubbleClass },
              timeFormatted
            )
          );
        }
      });
      return listItems;
    }
  }, {
    key: 'render',
    value: function render() {
      var messages = this.props.messages;

      var chatList = this.getConversations(messages);

      return _react2.default.createElement(
        'div',
        { className: 'chats' },
        chatList
      );
    }
  }]);

  return ChatBubble;
}(_react.Component);

ChatBubble.propTypes = {
  messages: _propTypes2.default.array.isRequired
};

exports.default = ChatBubble;
