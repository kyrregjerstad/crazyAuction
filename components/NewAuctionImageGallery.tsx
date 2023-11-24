import { X as DeleteIcon } from 'lucide-react';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Image from 'next/image';
import React from 'react';
import { Button } from './ui/button';

import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

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
    zIndex: isDragging ? 100 : 0,
    scale: isDragging ? 1.1 : 1,
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, opacity 0.2s ease-in-out, scale 0.2s ease-in-out`,
  };

  return (
    <motion.div
      className={cn('relative', isDragging && 'z-50')}
      key={image}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
    >
      <RemoveImageButton
        image={image}
        handleRemoveImage={handleRemoveImage}
        isSorting={isSorting}
      />
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={cn(
            'relative aspect-square max-w-[150px] overflow-hidden rounded-md border transition-shadow lg:max-w-[250px]',
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
            className='h-full w-full max-w-full rounded-lg object-cover'
          />
        </div>
      </div>
    </motion.div>
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
    <>
      {images.length === 0 ? (
        <div className='flex h-full w-full max-w-lg flex-wrap items-center justify-center gap-4 md:max-w-xl'>
          <p className='text-sm text-neutral-500'>
            Auctions with images are more likely to sell. Add up to 8 images
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className='flex h-fit w-full max-w-lg flex-wrap gap-4 md:max-w-xl'>
              <AnimatePresence>
                {images.map((image, index) => (
                  <SortableItem
                    key={image}
                    index={index}
                    image={image}
                    handleRemoveImage={handleRemoveImage}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
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
