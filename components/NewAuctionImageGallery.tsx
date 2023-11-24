import { X as DeleteIcon } from 'lucide-react';

import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

type SortableItemProps = {
  image: string;
  index: number;
  handleRemoveImage: (image: string) => void;
};

const SortableItem = ({
  image,
  index,
  handleRemoveImage,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: image });

  const style: React.CSSProperties = {
    zIndex: isDragging ? 2000 : 0,
    scale: isDragging ? 1.1 : 1,
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, opacity 0.2s ease-in-out, scale 0.2s ease-in-out`,
  };

  return (
    <div className={cn('group-preview-image relative', isDragging && 'z-50')}>
      <RemoveImageButton
        image={image}
        handleRemoveImage={handleRemoveImage}
        isSorting={isSorting}
      />
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={cn(
            'relative aspect-square max-w-[150px] overflow-hidden rounded-md border transition-shadow',
            isDragging ? 'border border-accent shadow-md' : 'shadow-none',
          )}
        >
          <span
            className={cn(
              'absolute left-0 top-0 flex aspect-square w-6 items-center justify-center rounded-sm bg-neutral-500/70 text-center transition-opacity',
              isSorting ? 'opacity-0' : 'opacity-100',
            )}
          >
            {index + 1}
          </span>
          <Image
            src={image}
            width={200}
            height={200}
            alt='test'
            className='h-auto w-full max-w-full rounded-lg'
          />
        </div>
      </div>
    </div>
  );
};

type ImageGalleryProps = {
  images: string[];
  setImages: (images: string[]) => void;
};

const NewAuctionImageGallery = ({ images, setImages }: ImageGalleryProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleRemoveImage = (clickedImg: string) => {
    const updatedImages = images.filter((img) => img !== clickedImg);
    console.log('click', clickedImg, updatedImages);
    setImages(updatedImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.indexOf(active.id.toString());
      const newIndex = images.indexOf(over?.id?.toString() || '');

      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className='flex h-fit flex-wrap gap-4'>
          {images.map((image, index) => (
            <SortableItem
              key={image}
              index={index}
              image={image}
              handleRemoveImage={handleRemoveImage}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default NewAuctionImageGallery;

type RemoveImageButtonProps = {
  image: string;
  handleRemoveImage: (image: string) => void;
  isSorting: boolean;
};

const RemoveImageButton = ({
  image,
  handleRemoveImage,
  isSorting,
}: RemoveImageButtonProps) => (
  <Button
    variant='outline'
    size='iconSm'
    className={cn(
      'absolute right-0 top-0 z-50 p-1 opacity-100 transition-opacity duration-300',
      isSorting && 'opacity-0',
    )}
    onClick={() => handleRemoveImage(image)}
  >
    <DeleteIcon className='h-4 w-4' />
  </Button>
);
