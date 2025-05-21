import React, { useState } from 'react';
import { Circle, Rect, Text, Image } from 'react-konva';

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
}

interface RectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
}

interface TextProps {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  rotation: number;
}

interface ImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement | null;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  rotation: number;
}

const renderCircle = (props: any) => {
  const radius = props.radius || 0;
  
  return (
    <Circle
      x={props.x}
      y={props.y}
      radius={radius}
      fill={props.fill}
      id={props.id}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={props.onClick}
    />
  );
};

const renderRectangle = (props: any) => {
  return (
    <Rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      fill={props.fill}
      id={props.id}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={props.onClick}
    />
  );
};

const renderText = (props: any) => {
  return (
    <Text
      x={props.x}
      y={props.y}
      text={props.text}
      fontSize={props.fontSize}
      fontFamily={props.fontFamily}
      fill={props.fill}
      id={props.id}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={props.onClick}
      rotation={props.rotation}
    />
  );
};

const renderImage = (props: any) => {
  return (
    <Image
      x={props.x}
      y={props.y}
      image={props.image}
      width={props.width}
      height={props.height}
      id={props.id}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={props.onClick}
      rotation={props.rotation}
    />
  );
};

const ShapeRenderer = {
  circle: renderCircle,
  rectangle: renderRectangle,
  text: renderText,
  image: renderImage,
};

export default ShapeRenderer;
