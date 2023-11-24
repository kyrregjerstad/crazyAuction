import { X as DeleteIcon } from 'lucide-react';

import Image from '@/components/Image';
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
import React from 'react';
import { Button } from './ui/button';

import { AuctionForm } from '@/lib/services/postListing';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { UseFormSetValue } from 'react-hook-form';

type ImageGalleryProps = {
  images: string[];
  setValue: UseFormSetValue<AuctionForm>;
};

const NewAuctionImageGallery = ({ images, setValue }: ImageGalleryProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleRemoveImage = (clickedImg: string) => {
    const updatedImageUrls = images.filter((img) => img !== clickedImg);
    setValue('imageUrls', updatedImageUrls, { shouldValidate: true });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.indexOf(active.id.toString());
      const newIndex = images.indexOf(over?.id?.toString() || '');

      const newImageOrder = arrayMove(images, oldIndex, newIndex);
      setValue('imageUrls', newImageOrder, { shouldValidate: true });
    }
  };

  return (
    <>
      {images.length === 0 ? (
        <div className='flex h-full w-full max-w-lg flex-wrap items-center justify-center gap-4 pt-8 md:max-w-xl'>
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
            <div className='flex h-fit w-full max-w-lg flex-wrap gap-4 pt-8 md:max-w-xl'>
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
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'relative aspect-square max-w-[150px] overflow-hidden rounded-md border transition-shadow lg:max-w-[250px]',
          isDragging ? 'border border-accent shadow-md' : 'shadow-none',
        )}
      >
        <IndexIndicator index={index} />
        <Image
          src={image}
          width={200}
          height={200}
          alt='test'
          className='h-full w-full max-w-full rounded-lg object-cover'
        />
      </div>
    </motion.div>
  );
};

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

const IndexIndicator = ({ index }: { index: number }) => (
  <span className='absolute left-0 top-0 flex aspect-square w-6 items-center justify-center rounded-sm bg-neutral-500/70 text-center'>
    {index + 1}
  </span>
);
