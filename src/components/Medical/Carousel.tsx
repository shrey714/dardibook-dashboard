"use client";

import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { createContext } from "react";
import MedicalReport from "./MedicalReport";
import { BookUser } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Button } from "../ui/button";
import Link from "next/link";

type CarouselContextProps = {
  carouselOptions?: EmblaOptionsType;
  orientation?: "vertical" | "horizontal";
  plugins?: Parameters<typeof useEmblaCarousel>[1];
};

type DirectionOption = "ltr" | "rtl" | undefined;

type CarouselContextType = {
  emblaMainApi: ReturnType<typeof useEmblaCarousel>[1];
  mainRef: ReturnType<typeof useEmblaCarousel>[0];
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  activeIndex: number;
  onThumbClick: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  orientation: "vertical" | "horizontal";
  direction: DirectionOption;
} & CarouselContextProps;

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

const Carousel = forwardRef<
  HTMLDivElement,
  CarouselContextProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      carouselOptions,
      orientation = "horizontal",
      dir,
      plugins,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
      {
        ...carouselOptions,
        axis: orientation === "vertical" ? "y" : "x",
        watchDrag: false,
        direction: carouselOptions?.direction ?? (dir as DirectionOption),
      },
      plugins
    );

    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
      {
        ...carouselOptions,
        axis: orientation === "vertical" ? "y" : "x",
        watchDrag: true,
        direction: carouselOptions?.direction ?? (dir as DirectionOption),
        containScroll: "keepSnaps",
        dragFree: true,
      },
      plugins
    );

    const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
    const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const ScrollNext = useCallback(() => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollNext();
    }, [emblaMainApi]);

    const ScrollPrev = useCallback(() => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollPrev();
    }, [emblaMainApi]);

    const direction = carouselOptions?.direction ?? (dir as DirectionOption);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!emblaMainApi) return;
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            if (orientation === "horizontal") {
              if (direction === "rtl") {
                ScrollNext();
                return;
              }
              ScrollPrev();
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            if (orientation === "horizontal") {
              if (direction === "rtl") {
                ScrollPrev();
                return;
              }
              ScrollNext();
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (orientation === "vertical") {
              ScrollPrev();
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (orientation === "vertical") {
              ScrollNext();
            }
            break;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [emblaMainApi, orientation, direction]
    );

    const onThumbClick = useCallback(
      (index: number) => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        emblaMainApi.scrollTo(index);
      },
      [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      const selected = emblaMainApi.selectedScrollSnap();
      setActiveIndex(selected);
      emblaThumbsApi.scrollTo(selected);
      setCanScrollPrev(emblaMainApi.canScrollPrev());
      setCanScrollNext(emblaMainApi.canScrollNext());
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
      if (!emblaMainApi) return;
      onSelect();
      emblaMainApi.on("select", onSelect);
      emblaMainApi.on("reInit", onSelect);
      return () => {
        emblaMainApi.off("select", onSelect);
      };
    }, [emblaMainApi, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          emblaMainApi,
          mainRef: emblaMainRef,
          thumbsRef: emblaThumbsRef,
          scrollNext: ScrollNext,
          scrollPrev: ScrollPrev,
          canScrollNext,
          canScrollPrev,
          activeIndex,
          onThumbClick,
          handleKeyDown,
          carouselOptions,
          direction,
          orientation:
            orientation ||
            (carouselOptions?.axis === "y" ? "vertical" : "horizontal"),
        }}
      >
        <div
          {...props}
          tabIndex={0}
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={`grid gap-2 w-full relative focus:outline-none ${className}`}
          dir={direction}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

const CarouselMainContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { mainRef, orientation, direction } = useCarousel();

  return (
    <div {...props} ref={mainRef} className="overflow-hidden" dir={direction}>
      <div
        ref={ref}
        className={`flex
          ${orientation === "vertical" ? "flex-col" : ""}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
});

CarouselMainContainer.displayName = "CarouselMainContainer";

const CarouselThumbsContainer = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { thumbsRef, orientation, direction } = useCarousel();

  return (
    <div {...props} ref={thumbsRef} className="z-10" dir={direction}>
      <div
        ref={ref}
        className={`
          flex
          ${orientation === "vertical" ? "flex-col" : "flex-row"}
          ${className}`}
      >
        {children}
      </div>
    </div>
  );
});

CarouselThumbsContainer.displayName = "CarouselThumbsContainer";

const SliderMainItem = forwardRef<
  HTMLDivElement,
  {
    patient: any;
    selectedPatientId: any;
    setdrawerState: any;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, patient, selectedPatientId, setdrawerState, ...props },
    ref
  ) => {
    const { orientation } = useCarousel();
    return (
      <div
        {...props}
        ref={ref}
        className={`min-w-0 shrink-0 grow-0 basis-[calc(100%-8px)] bg-secondary relative ${
          orientation === "vertical" ? "pb-1" : "mx-[4px]"
        } ${className}
        `}
      >
        {/* Page content here */}
        <Button
          onClick={() => {
            setdrawerState(true);
          }}
          className="absolute top-2 right-2 aspect-square"
        >
          <BookUser />
        </Button>
        {patient.attended ? (
          <MedicalReport
            patient={patient}
            selectedPatientId={selectedPatientId}
          />
        ) : (
          <div className="font-semibold text-sm md:text-base lg:text-lg p-2">
            Prescription is not generated yet.
          </div>
        )}
      </div>
    );
  }
);

SliderMainItem.displayName = "SliderMainItem";

const SliderThumbItem = forwardRef<
  HTMLDivElement,
  {
    index: number;
    patient: any;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, patient, ...props }, ref) => {
  const { activeIndex, onThumbClick, orientation } = useCarousel();
  const isSlideActive = activeIndex === index;
  return (
    <div
      {...props}
      ref={ref}
      onClick={() => {
        onThumbClick(index);
      }}
      className={`min-w-0 w-1 flex shrink-0 grow-0 basis-[calc((100%-24px)/3)] lg:basis-[calc((100%-48px)/6)] p-0
        ${orientation === "vertical" ? "pb-1" : "mx-[4px]"}
        ${className}
      `}
    >
      <Link
        href={{
          pathname: "medicalForm",
          query: { patientId: patient.patient_unique_Id },
        }}
        replace
        className="w-full"
      >
        <HoverCard openDelay={110} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div
              className={`${
                patient.attended ? "border-green-600" : ""
              } border-2 relative h-10 transition-opacity ${
                patient.attended ? "bg-green-600/30" : ""
              } w-full flex flex-wrap items-center justify-center rounded-md cursor-pointer text-sm md:text-base font-semibold ${
                isSlideActive
                  ? patient.attended
                    ? "!bg-green-600 !text-white"
                    : "!bg-secondary"
                  : ""
              }`}
            >
              {patient.patient_unique_Id}
              <BookUser className="size-5 ml-2" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="bg-background mt-1 w-auto">
            <ul tabIndex={patient.patient_unique_Id}>
              <li>
                {patient.first_name} {patient.last_name}
              </li>
              <li>{patient.gender}</li>
              <li>{patient.mobile_number}</li>
            </ul>
          </HoverCardContent>
        </HoverCard>
      </Link>
    </div>
  );
});

SliderThumbItem.displayName = "SliderThumbItem";

export {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
  useCarousel,
};
