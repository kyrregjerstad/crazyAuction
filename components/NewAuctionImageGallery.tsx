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
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';

import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadImage } from './new-auction-form/types';

type ImageGalleryProps = {
  images: UploadImage[];
  setImages: Dispatch<SetStateAction<UploadImage[]>>;
};

const NewAuctionImageGallery = ({ images, setImages }: ImageGalleryProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleRemoveImage = (image: UploadImage) => {
    const newImages = images.filter((img) => img.id !== image.id);
    setImages(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((images) => {
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over?.id);

        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      {images.length === 0 ? null : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className='flex h-fit w-full flex-wrap justify-center gap-2'>
              <AnimatePresence>
                {images.map((image, index) => (
                  <SortableItem
                    key={image.id}
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
  image: UploadImage;
  index: number;
  handleRemoveImage: (image: UploadImage) => void;
};

const SortableItem = ({
  image,
  index,
  handleRemoveImage,
}: SortableItemProps) => {
  const { id, previewUrl } = image;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    zIndex: isDragging ? 100 : 0,
    scale: isDragging ? 1.1 : 1,
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, opacity 0.2s ease-in-out, scale 0.2s ease-in-out`,
  };

  return (
    <motion.div
      className={cn('relative', isDragging && 'z-50')}
      key={id}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
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
          'relative aspect-square w-full max-w-[65px] overflow-hidden rounded-md border transition-shadow xs:max-w-[100px] ',
          isDragging ? 'border border-accent shadow-md' : 'shadow-none',
        )}
      >
        <IndexIndicator index={index} />
        <Image
          src={previewUrl}
          width={200}
          height={200}
          alt='test'
          className='h-full w-full max-w-full rounded-lg object-cover'
          data-testid='draggable-image'
        />
      </div>
    </motion.div>
  );
};

type RemoveImageButtonProps = {
  image: UploadImage;
  handleRemoveImage: (image: UploadImage) => void;
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
    onClick={(e) => {
      e.stopPropagation(); // to prevent the upload dialog from opening
      handleRemoveImage(image);
    }}
  >
    <DeleteIcon color='white' className='h-4 w-4' />
  </Button>
);

const IndexIndicator = ({ index }: { index: number }) => (
  <span className='absolute left-0 top-0 flex aspect-square w-6 items-center justify-center rounded-sm bg-neutral-500/70 text-center'>
    {index + 1}
  </span>
);
