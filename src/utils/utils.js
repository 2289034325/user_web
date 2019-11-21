import React from 'react';

export const Lang = {
  EN: {value: 1, name: "English", code: "EN"},
  JP: {value: 2, name: "日本語", code: "JP"},
  KR: {value: 3, name: "한국어", code: "KR"},
  FR: {value: 4, name: "français", code: "FR"},
  all : [{value: 1, name: "English", code: "EN"},{value: 2, name: "日本語", code: "JP"},{value: 3, name: "한국어", code: "KR"},{value: 4, name: "français", code: "FR"}],
  getName(n){
    if(n == 1 ){
      return "English";
    }
    if(n == 2 ){
      return "日本語";
    }
    if(n == 3 ){
      return "한국어";
    }
    if(n == 4 ){
      return "français";
    }

    return "";
  }
};

export const MediaUsage = {
  ORIGIN: {value: 1, name: "origin"},
  EXPLAIN: {value: 2, name: "explain"},
  all : [{value: 1, name: "origin"},{value: 2, name: "explain"}],
  getName(n){
    if(n == 1 ){
      return "origin";
    }
    if(n == 2 ){
      return "explain";
    }

    return "";
  }
};
