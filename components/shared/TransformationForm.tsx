"use client";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string().optional(),
});

const TransformationForm = ({
  action,
  data = null,
  type,
  creditBalance,
  userId,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState();
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const initialValue =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const onSelectFieldhandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prev: any) => ({
      ...prev,
      aspectRatio: value,
      width: imageSize?.width,
      height: imageSize?.height,
    }));

    setNewTransformation(transformationType.config);
    return onChangeField(value);
  };

  const onInputChangehandler = (
    field: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prev: any) => ({
        ...prev,
        [type]: {
          ...prev?.[type],
          [field === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000);
    return onChangeField(value);
  };

  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    setNewTransformation(null)

    startTransition(async ()=>{

    })
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />
      </form>
      {type === "fill" && (
        <CustomField
          control={form.control}
          name="aspectRatio"
          formLabel="Aspect Ratio"
          className="w-full"
          render={({ field }) => (
            <Select
              onValueChange={(value) =>
                onSelectFieldhandler(value, field.onchange)
              }
            >
              <SelectTrigger className="select-field">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(aspectRatioOptions).map((value) => (
                  <SelectItem key={value} value={value} className="select-item">
                    {aspectRatioOptions[value as AspectRatioKey].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}

      {(type === "remove" || type === "recolor") && (
        <div className="prompt-field">
          <CustomField
            control={form.control}
            name="prompt"
            formLabel={
              type === "remove" ? "object to remove" : "Object to recolor"
            }
            className="w-full"
            render={({ field }) => (
              <Input
                value={field.value}
                className="input-field"
                onChange={(e) =>
                  onInputChangehandler(
                    "prompt",
                    e.target.value,
                    type,
                    field.onChange
                  )
                }
              />
            )}
          />

          {type === "recolor" && (
            <CustomField
              control={form.control}
              name="color"
              formLabel="Replacement Color"
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) =>
                    onInputChangehandler(
                      "color",
                      e.target.value,
                      "recolor",
                      field.onChange
                    )
                  }
                />
              )}
            />
          )}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Button
          className="submit-button capitalize"
          type="button"
          disabled={isTransforming || newTransformation === null}
          onClick={onTransformHandler}
        >
          {isTransforming ? "Transforming..." : "Apply"}
        </Button>

        <Button
          type="submit"
          className="submit-button capitalize"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save Image"}
        </Button>
      </div>
    </Form>
  );
};

export default TransformationForm;
