"use client";

import { useState } from "react";
import {
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from "../mutations/use-coupon.mutation";
import { CreateCouponDto, UpdateCouponDto } from "../../api/coupons.api";
import { useAllCoupons } from "../query/use-coupon.query";

export function useAdminCoupons() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<UpdateCouponDto | null>(
    null
  );

  // Queries
  const { data: coupons, isLoading, error } = useAllCoupons();

  // Mutations
  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  // Actions
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (coupon: UpdateCouponDto) => {
    setCurrentCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentCoupon(null);
    setIsEditModalOpen(false);
  };

  const handleCreateCoupon = async (data: CreateCouponDto) => {
    try {
      await createCouponMutation.mutateAsync(data);
      closeCreateModal();
      return true;
    } catch (error) {
      console.error("Failed to create coupon:", error);
      return false;
    }
  };

  const handleUpdateCoupon = async (data: UpdateCouponDto) => {
    try {
      await updateCouponMutation.mutateAsync(data);
      closeEditModal();
      return true;
    } catch (error) {
      console.error("Failed to update coupon:", error);
      return false;
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await deleteCouponMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      return false;
    }
  };

  return {
    coupons,
    isLoading,
    error,
    isCreateModalOpen,
    isEditModalOpen,
    currentCoupon,
    isCreating: createCouponMutation.isPending,
    isUpdating: updateCouponMutation.isPending,
    isDeleting: deleteCouponMutation.isPending,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    createCoupon: handleCreateCoupon,
    updateCoupon: handleUpdateCoupon,
    deleteCoupon: handleDeleteCoupon,
  };
}
